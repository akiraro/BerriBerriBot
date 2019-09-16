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
        text: "Yes",
        callback_data: letter + "Yes"
      },
      {
        text: "No",
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
      message = "!! REMINDER !!\nHave you cook for today ?";
      break;
    case "dish":
      message = "!! REMINDER !!\nHave you do the dishes ?";
      break;
    case "trash":
      message = "!! REMINDER !!\nHave you take out the trash ?";
      break;
    case "clean":
      message = "!! REMINDER !!\nHave you clean the kitchen ?";
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

function processReminder(data, res) {
  var d = new Date();
  var n = getDay(d.getDay());

  for (var i = 0; i < data.length; i++) {
    switch (data[i].job) {
      case "cook":
        Message.sendMessage(
          data[i].user_id,
          generateMessage(data[i].job),
          { inline_keyboard: generateInlineKeyboard(data[i].job) },
          res
        );
        break;

      case "clean":
        if (n == "sunday") {
          Message.sendMessage(
            data[i].user_id,
            generateMessage(data[i].job),
            { inline_keyboard: generateInlineKeyboard(data[i].job) },
            res
          );
        }
        break;

      case "dish":
        Message.sendMessage(
          data[i].user_id,
          generateMessage(data[i].job),
          { inline_keyboard: generateInlineKeyboard(data[i].job) },
          res
        );
        break;

      case "trash":
        if (n == "sunday" || n == "thursday") {
          Message.sendMessage(
            data[i].user_id,
            generateMessage(data[i].job),
            { inline_keyboard: generateInlineKeyboard(data[i].job) },
            res
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

exports.sendReminder = res => {
  const queryString = "SELECT * FROM cron WHERE status = 0";
  const queryString2 = "SELECT status FROM `?` WHERE user_id = ?";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        processReminder(rows, res);
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
    "UPDATE Cook SET sequence = ((SELECT sequence FROM (SELECT * FROM Cook)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE user_id = (SELECT user_id FROM (SELECT * FROM Cook ORDER BY sequence ASC LIMIT 1)  AS temp) ";
  const queryString2 = "DELETE FROM cron WHERE job = 'cook'";
  const queryString3 = "SELECT * FROM `cook` ORDER BY sequence ASC LIMIT 1";
  const queryString4 =
    "INSERT INTO `cron` (`id`,`user_id`,`job`,`status`) VALUES (?,?,?,?)";

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
                  ["DEFAULT", rows3[0].user_id, "cook", 0],
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
    "UPDATE clean SET sequence = ((SELECT sequence FROM (SELECT * FROM clean)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE user_id = (SELECT user_id FROM (SELECT * FROM clean ORDER BY sequence ASC LIMIT 1)  AS temp) ";
  const queryString2 = "DELETE FROM cron WHERE job = 'clean'";
  const queryString3 = "SELECT * FROM `clean` ORDER BY sequence ASC LIMIT 1";
  const queryString4 =
    "INSERT INTO `cron` (`id`,`user_id`,`job`,`status`) VALUES (?,?,?,?)";

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
                  ["DEFAULT", rows3[0].user_id, "clean", 0],
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
    "UPDATE trash SET sequence = ((SELECT sequence FROM (SELECT * FROM trash)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE user_id = (SELECT user_id FROM (SELECT * FROM trash ORDER BY sequence ASC LIMIT 1)  AS temp) ";
  const queryString2 = "DELETE FROM cron WHERE job = 'trash'";
  const queryString3 = "SELECT * FROM `trash` ORDER BY sequence ASC LIMIT 1";
  const queryString4 =
    "INSERT INTO `cron` (`id`,`user_id`,`job`,`status`) VALUES (?,?,?,?)";

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
                  ["DEFAULT", rows3[0].user_id, "trash", 0],
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
    "UPDATE dish SET sequence = ((SELECT sequence FROM (SELECT * FROM dish)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE user_id = (SELECT user_id FROM (SELECT * FROM dish ORDER BY sequence ASC LIMIT 1)  AS temp) ";
  const queryString2 = "DELETE FROM cron WHERE job = 'dish'";
  const queryString3 = "SELECT * FROM `dish` ORDER BY sequence ASC LIMIT 1";
  const queryString4 =
    "INSERT INTO `cron` (`id`,`user_id`,`job`,`status`) VALUES (?,?,?,?)";

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
                  ["DEFAULT", rows3[0].user_id, "dish", 0],
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
