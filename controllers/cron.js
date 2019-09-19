const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

var Message = require("../message.js");

/**
 * @param {string} type
 * Generate InlineKeyboard based on type of job
 */
function generateInlineKeyboard(type) {
  var letter = "";
  switch (type) {
    case "cook":
      letter = "C";
      break;
    case "dish":
      letter = "V";
      break;
    case "trash":
      letter = "X";
      break;
    case "clean":
      letter = "Y";
      break;
  }

  var inlineKeyboard = [
    [
      {
        text: "Yes \u{2705}",
        callback_data: letter + "Yes"
      },
      {
        text: "No \u{274C}",
        callback_data: letter + "No"
      }
    ]
  ];

  return inlineKeyboard;
}
/**
 *
 * @param {string} type
 * Generate Message based on type of job
 */
function generateMessage(type) {
  var message = "";

  switch (type) {
    case "cook":
      message = "\u{1F50A} REMINDER \u{1F50A}\nHave you cook for today ?";
      break;
    case "dish":
      message = "\u{1F50A} REMINDER \u{1F50A}\nHave you do the dishes ?";
      break;
    case "trash":
      message = "\u{1F50A} REMINDER \u{1F50A}\nHave you take out the trash ?";
      break;
    case "clean":
      message = "\u{1F50A} REMINDER \u{1F50A}\nHave you clean the kitchen ?";
      break;
  }

  return message;
}

function getDay(value) {
  var day = "";
  switch (value) {
    case 0:
      day = "sunday";
      break;
    case 1:
      day = "monday";
      break;
    case 2:
      day = "tuesday";
      break;
    case 3:
      day = "wednesday";
      break;
    case 4:
      day = "thursday";
      break;
    case 5:
      day = "friday";
      break;
    case 6:
      day = "saturday";
      break;
  }

  return day;
}

function processReminder(data) {
  var d = new Date();
  var n = getDay(d.getDay());

  for (var i = 0; i < data.length; i++) {
    switch (data[i].job) {
      case "cook":
        Message.sendCronMessage(data[i].user_id, generateMessage(data[i].job), {
          inline_keyboard: generateInlineKeyboard(data[i].job)
        });
        break;

      case "clean":
        if (n == "sunday") {
          Message.sendCronMessage(
            data[i].user_id,
            generateMessage(data[i].job),
            {
              inline_keyboard: generateInlineKeyboard(data[i].job)
            }
          );
        }
        break;

      case "dish":
        Message.sendCronMessage(data[i].user_id, generateMessage(data[i].job), {
          inline_keyboard: generateInlineKeyboard(data[i].job)
        });
        break;

      case "trash":
        if (n == "sunday" || n == "thursday") {
          Message.sendCronMessage(
            data[i].user_id,
            generateMessage(data[i].job),
            {
              inline_keyboard: generateInlineKeyboard(data[i].job)
            }
          );
        }
        break;
    }
  }
}

/**
 * CRON JOB FUNCTIONALITY
 * Check up the cron database and send reminders
 */

exports.sendReminder = () => {
  const queryString = "SELECT * FROM cron WHERE status = 0";
  const queryString2 = "SELECT status FROM `?` WHERE user_id = ?";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        processReminder(rows);
      }
    });
  });
};

/**
 * CRON JOB FUNCTIONALITY
 * Update cron database
 */

exports.changeStatus = (type, res) => {
  const queryString = "UPDATE cron SET status = 1 WHERE job = ?";
  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [type], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        connection.release();
      }
    });
  });
};

/**
 * CRON JOB FUNCTIONALITY
 * Update cron database
 */

exports.shiftSchedule = res => {
  console.log("SHIFT SCHEDULE CRON");
  var d = new Date();
  var n = getDay(d.getDay());

  shiftCookSchedule(); // Shift cook schedule everyday
  shiftDishSchedule(); // Shift dish schedule everyday

  if (n == "monday") {
    //Every Monday 12.01 AM, server will shift clean and trash schedule
    shiftCleanSchedule();
    shiftTrashSchedule();
  } else if (n == "friday") {
    //Every Monday 12.01 AM, server will shift trash schedule
    shiftTrashSchedule();
  }
};

/**
 * CRON JOB FUNCTIONALITY
 * Shift the cook schedule every day
 */
function shiftCookSchedule() {
  /**
   * queryString -> Shift the first user in cook schedule to be the last
   * queryString2 -> Delete the cron job for cook
   * queryString3 -> Get the next user for cook
   * queryString4 -> Add the user into cron
   */
  const queryString =
    "UPDATE Cook SET sequence = ((SELECT sequence FROM (SELECT * FROM Cook)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE id = (SELECT id FROM (SELECT * FROM Cook ORDER BY sequence ASC LIMIT 1)  AS temp) ";
  const queryString2 = "DELETE FROM cron WHERE job = 'cook'";
  const queryString3 = "SELECT * FROM `cook` ORDER BY sequence ASC LIMIT 1";
  const queryString4 =
    "INSERT INTO `cron` (`id`,`user_id`,`username`,`job`,`status`) VALUES (?,?,?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        connection.query(queryString2, [], (err2, rows2, fields2) => {
          if (err2) {
            throw err2;
          } else {
            connection.query(queryString3, [], (err3, rows3, fields3) => {
              if (err3) {
                throw err3;
              } else {
                connection.query(
                  queryString4,
                  ["DEFAULT", rows3[0].user_id, rows3[0].username, "cook", 0],
                  (err4, rows4, fields4) => {
                    if (err4) {
                      throw err4;
                    } else {
                      connection.release();
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  });
}

/**
 * CRON JOB FUNCTIONALITY
 * Shift the clean schedule once a week
 */
function shiftCleanSchedule() {
  /**
   * queryString -> Shift the first user in clean schedule to be the last
   * queryString2 -> Delete the cron job for clean
   * queryString3 -> Get the next user for clean
   * queryString4 -> Add the user into cron
   */
  const queryString =
    "UPDATE clean SET sequence = ((SELECT sequence FROM (SELECT * FROM clean)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE id = (SELECT id FROM (SELECT * FROM clean ORDER BY sequence ASC LIMIT 1)  AS temp) ";
  const queryString2 = "DELETE FROM cron WHERE job = 'clean'";
  const queryString3 = "SELECT * FROM `clean` ORDER BY sequence ASC LIMIT 1";
  const queryString4 =
    "INSERT INTO `cron` (`id`,`user_id`,`username`,`job`,`status`) VALUES (?,?,?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        connection.query(queryString2, [], (err2, rows2, fields2) => {
          if (err2) {
            throw err2;
          } else {
            connection.query(queryString3, [], (err3, rows3, fields3) => {
              if (err3) {
                throw err3;
              } else {
                connection.query(
                  queryString4,
                  ["DEFAULT", rows3[0].user_id, rows3[0].username, "clean", 0],
                  (err4, rows4, fields4) => {
                    if (err4) {
                      throw err4;
                    } else {
                      connection.release();
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  });
}

/**
 * CRON JOB FUNCTIONALITY
 * Shift the trash schedule every Sunday and Thursday
 */
function shiftTrashSchedule() {
  /**
   * queryString -> Shift the first user in trash schedule to be the last
   * queryString2 -> Delete the cron job for trash
   * queryString3 -> Get the next user for trash
   * queryString4 -> Add the user into cron
   */
  const queryString =
    "UPDATE trash SET sequence = ((SELECT sequence FROM (SELECT * FROM trash)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE id = (SELECT id FROM (SELECT * FROM trash ORDER BY sequence ASC LIMIT 1)  AS temp) ";
  const queryString2 = "DELETE FROM cron WHERE job = 'trash'";
  const queryString3 = "SELECT * FROM `trash` ORDER BY sequence ASC LIMIT 1";
  const queryString4 =
    "INSERT INTO `cron` (`id`,`user_id`,`username`,`job`,`status`) VALUES (?,?,?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        connection.query(queryString2, [], (err2, rows2, fields2) => {
          if (err2) {
            throw err2;
          } else {
            connection.query(queryString3, [], (err3, rows3, fields3) => {
              if (err3) {
                throw err3;
              } else {
                connection.query(
                  queryString4,
                  ["DEFAULT", rows3[0].user_id, rows3[0].username, "trash", 0],
                  (err4, rows4, fields4) => {
                    if (err4) {
                      throw err4;
                    } else {
                      connection.release();
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  });
}

/**
 * CRON JOB FUNCTIONALITY
 * Shift the dish schedule everyday
 */
function shiftDishSchedule() {
  /**
   * queryString -> Shift the first user in dish schedule to be the last
   * queryString2 -> Delete the cron job for dish
   * queryString3 -> Get the next user for dish
   * queryString4 -> Add the user into cron
   */
  const queryString =
    "UPDATE dish SET sequence = ((SELECT sequence FROM (SELECT * FROM dish)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE id = (SELECT id FROM (SELECT * FROM dish ORDER BY sequence ASC LIMIT 1)  AS temp) ";
  const queryString2 = "DELETE FROM cron WHERE job = 'dish'";
  const queryString3 = "SELECT * FROM `dish` ORDER BY sequence ASC LIMIT 1";
  const queryString4 =
    "INSERT INTO `cron` (`id`,`user_id`,`username`,`job`,`status`) VALUES (?,?,?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        connection.query(queryString2, [], (err2, rows2, fields2) => {
          if (err2) {
            throw err2;
          } else {
            connection.query(queryString3, [], (err3, rows3, fields3) => {
              if (err3) {
                throw err3;
              } else {
                connection.query(
                  queryString4,
                  ["DEFAULT", rows3[0].user_id, rows3[0].username, "dish", 0],
                  (err4, rows4, fields4) => {
                    if (err4) {
                      throw err4;
                    } else {
                      connection.release();
                    }
                  }
                );
              }
            });
          }
        });
      }
    });
  });
}

/**
 * Generate schedule with day
 */

exports.generateScheduleDate = data => {
  var schedule = [];
  var d = new Date();
  var n = d.getDay();

  for (var i = 0; i < data.length; i++) {
    schedule.push(
      i + 1 + ". " + data[i].username + " - " + getDay((n + i) % 7) + "\n"
    );
  }

  return schedule;
};

/**
 * Get status of all cron jobs
 */
exports.getStatus = cb => {
  var d = new Date();
  var n = getDay(d.getDay());

  const queryString = "SELECT * FROM cron";

  var message = "\u{1F3E0} RUE BERRI CHORES \u{1F3E0}\n";
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].job == "cook") {
            if (rows[i].status == 0) {
              message =
                message +
                "\u{1F468}\u{200D}\u{1F373}" +
                " \t" +
                rows[i].job.toUpperCase() +
                " - " +
                rows[i].username +
                " -> " +
                n +
                "\t \u{274C}" +
                "\n";
            } else {
              message =
                message +
                "\u{1F468}\u{200D}\u{1F373}" +
                " \t" +
                rows[i].job.toUpperCase() +
                " - " +
                rows[i].username +
                " -> " +
                n +
                "\t \u{2705}" +
                "\n";
            }
          } else if (rows[i].job == "dish") {
            if (rows[i].status == 0) {
              message =
                message +
                "\u{1F37D} \t" +
                rows[i].job.toUpperCase() +
                " - " +
                rows[i].username +
                " -> " +
                n +
                "\t \u{274C}" +
                "\n";
            } else {
              message =
                message +
                "\u{1F37D} \t" +
                rows[i].job.toUpperCase() +
                " - " +
                rows[i].username +
                " -> " +
                n +
                "\t \u{2705}" +
                "\n";
            }
          } else if (rows[i].job == "clean") {
            if (rows[i].status == 0) {
              message =
                message +
                "\u{1F9FC} \t" +
                rows[i].job.toUpperCase() +
                " - " +
                rows[i].username +
                " -> " +
                getDay(0) +
                "\t \u{274C}" +
                "\n";
            } else {
              message =
                message +
                "\u{1F9FC} \t" +
                rows[i].job.toUpperCase() +
                " - " +
                rows[i].username +
                " -> " +
                getDay(0) +
                "\t \u{2705}" +
                "\n";
            }
          } else if (rows[i].job == "trash") {
            if (d.getDay() == 0 || d.getDay() == 5 || d.getDay() == 6) {
              var day = "sunday";
            } else {
              var day = "thursday";
            }

            if (rows[i].status == 0) {
              message =
                message +
                "\u{1F5D1} \t" +
                rows[i].job.toUpperCase() +
                " - " +
                rows[i].username +
                " -> " +
                day +
                "\t \u{274C}" +
                "\n";
            } else {
              message =
                message +
                "\u{1F5D1} \t" +
                rows[i].job.toUpperCase() +
                " - " +
                rows[i].username +
                " -> " +
                day +
                "\t \u{2705}" +
                "\n";
            }
          }
        }
        cb(message);
        connection.release();
      }
    });
  });
};

exports.printSchedule = cookSchedule => {
  var d = new Date();

  var data = "\u{1F373} COOK SCHEDULE \u{1F373}\n";
  var today = new Date();
  for (var i = 0; i < cookSchedule.length; i++) {
    var loopToday = new Date();
    loopToday.setDate(today.getDate() + i);
    var dd = loopToday.getDate().toString();
    var mm = loopToday.getMonth();
    var yy = loopToday.getFullYear();
    data =
      data +
      "\u{1F4C5}" +
      dd +
      "/" +
      mm +
      "/" +
      yy +
      " (" +
      getDay((d.getDay() + i) % 6) +
      ")" +
      " - " +
      "\u{1F468}\u{200D}\u{1F373}" +
      cookSchedule[i].username +
      "\n";
  }

  return data;
};

exports.printScheduleForSwap = cookSchedule => {
  var d = new Date();
  var keyVal = "003";
  var data = "";
  var today = new Date();
  for (var i = 0; i < cookSchedule.length; i++) {
    var loopToday = new Date();
    loopToday.setDate(today.getDate() + i);
    var dd = loopToday.getDate().toString();
    var mm = loopToday.getMonth();
    var yy = loopToday.getFullYear();
    data =
      data +
      String.fromCharCode(parseInt(keyVal + (i + 1), 16)) +
      String.fromCharCode(parseInt("20E3", 16)) +
      ". \u{1F4C5}" +
      dd +
      "/" +
      mm +
      "/" +
      yy +
      " (" +
      getDay((d.getDay() + i) % 6) +
      ")" +
      " - " +
      "\u{1F468}\u{200D}\u{1F373}" +
      cookSchedule[i].username +
      "\n";
  }

  return data;
};
