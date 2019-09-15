const mysql = require("mysql");
const config = require("./config");
const pool = mysql.createPool(config);

var Message = require("./message.js");

/**
 * Initialization of database
 */
exports.initialize = (res, cb) => {
  const queryString = "SELECT * FROM `cook` LIMIT 1";
  const queryString2 =
    "INSERT INTO `cron` (`id`,`user_id`,`job`,`status`) VALUES (?,?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        console.log(rows);
        connection.query(
          queryString2,
          ["DEFAULT", rows[0].user_id, "cook", 0],
          (err2, rows2, fields2) => {
            if (err2) {
              console.log(err2);
              res.end();
            } else {
              console.log(rows2);
              connection.release();
              cb();
            }
          }
        );
      }
    });
  });
};

/**
 * Register User
 */
exports.registerUser = (id, username, res) => {
  const queryString =
    "INSERT INTO `Users` (`id`,`user_id`,`username`) VALUES (?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(
      queryString,
      ["DEFAULT", id, username],
      (err, rows, fields) => {
        if (err) {
          throw err;
        } else {
          console.log("SUCCESS : USER REGISTERED");
          connection.release();
          res.end();
        }
      }
    );
  });
};

/**
 * Check if the user is already existed in database
 */
exports.checkRegistered = (user_id, cb) => {
  const queryString = "SELECT username FROM Users WHERE `user_id` = ?";

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [user_id], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length != 0) {
        connection.release();
        cb(true);
      } else {
        connection.release();
        cb(false);
      }
    });
  });
};

/**
 * Get all users
 */
exports.getUsers = cb => {
  const queryString = "SELECT * FROM Users";

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length != 0) {
        connection.release();
        cb(rows);
      } else {
        connection.release();
      }
    });
  });
};

/**
 * Add user to cook schedule database
 */
exports.addCookSchedule = (user_id, username, res) => {
  const queryString = "SELECT * FROM Cook ORDER BY sequence DESC LIMIT 1";
  const queryString2 =
    "INSERT INTO `Cook` (sequence,user_id,username) VALUES (?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length == 0) {
        connection.query(
          queryString2,
          [1, user_id, username],
          (err2, rows2, fields2) => {
            if (err) {
              console.log(err);
            } else {
              connection.release();
              res.end("ok");
            }
          }
        );
      } else {
        connection.query(
          queryString2,
          [rows[0].sequence + 1, user_id, username],
          (err2, rows2, fields2) => {
            if (err) {
              console.log(err);
            } else {
              connection.release();
              res.end("ok");
            }
          }
        );
      }
    });
  });
};

/**
 * Add user to dish schedule database
 */
exports.addDishSchedule = (user_id, username, res) => {
  const queryString = "SELECT * FROM dish ORDER BY sequence DESC LIMIT 1";
  const queryString2 =
    "INSERT INTO `dish` (sequence,user_id,username) VALUES (?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length == 0) {
        connection.query(
          queryString2,
          [1, user_id, username],
          (err2, rows2, fields2) => {
            if (err) {
              console.log(err);
            } else {
              connection.release();
              res.end("ok");
            }
          }
        );
      } else {
        connection.query(
          queryString2,
          [rows[0].sequence + 1, user_id, username],
          (err2, rows2, fields2) => {
            if (err) {
              console.log(err);
            } else {
              connection.release();
              res.end("ok");
            }
          }
        );
      }
    });
  });
};

/**
 * Add user to trash schedule database
 */
exports.addTrashSchedule = (user_id, username, res) => {
  const queryString = "SELECT * FROM trash ORDER BY sequence DESC LIMIT 1";
  const queryString2 =
    "INSERT INTO `trash` (sequence,user_id,username) VALUES (?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length == 0) {
        connection.query(
          queryString2,
          [1, user_id, username],
          (err2, rows2, fields2) => {
            if (err) {
              console.log(err);
            } else {
              connection.release();
              res.end("ok");
            }
          }
        );
      } else {
        connection.query(
          queryString2,
          [rows[0].sequence + 1, user_id, username],
          (err2, rows2, fields2) => {
            if (err) {
              console.log(err);
            } else {
              connection.release();
              res.end("ok");
            }
          }
        );
      }
    });
  });
};

/**
 * Add user to clean schedule database
 */
exports.addCleanSchedule = (user_id, username, res) => {
  const queryString = "SELECT * FROM clean ORDER BY sequence DESC LIMIT 1";
  const queryString2 =
    "INSERT INTO `clean` (sequence,user_id,username) VALUES (?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length == 0) {
        connection.query(
          queryString2,
          [1, user_id, username],
          (err2, rows2, fields2) => {
            if (err) {
              console.log(err);
            } else {
              connection.release();
              res.end("ok");
            }
          }
        );
      } else {
        connection.query(
          queryString2,
          [rows[0].sequence + 1, user_id, username],
          (err2, rows2, fields2) => {
            if (err) {
              console.log(err);
            } else {
              connection.release();
              res.end("ok");
            }
          }
        );
      }
    });
  });
};

/**
 * Get the cook schedule
 */
exports.getCookSchedule = cb => {
  const queryString = "SELECT * FROM Cook ORDER BY sequence ASC";

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        connection.release();
        cb(rows);
      }
    });
  });
};

/**
 * Swap the requested user cook schedule with another user
 */
exports.swapCookSchedule = (user_id, cbQuery, res) => {
  const queryString = "SELECT sequence FROM cook WHERE user_id IN (?,?)";
  const queryString2 = "UPDATE cook SET sequence = ? WHERE user_id = ?";
  const queryString3 = "UPDATE cook SET sequence = ? WHERE user_id = ?";
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(
      queryString,
      [user_id, cbQuery.data.slice(1, cbQuery.data.length)],
      (err, rows, fields) => {
        if (err) {
          throw err;
        } else {
          connection.query(
            queryString2,
            [rows[0].sequence, cbQuery.data.slice(1, cbQuery.data.length)],
            (err2, rows2, fields2) => {
              if (err2) {
                throw err2;
              } else {
                connection.query(
                  queryString3,
                  [rows[1].sequence, user_id],
                  (err3, rows3, fields3) => {
                    if (err3) {
                      console.log(err3);
                    } else {
                      connection.release();
                      res.end("ok");
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
};

/**
 * Add grocery list
 */
exports.addGroceryList = (item, remark, res) => {
  const queryString = "INSERT INTO `grocery` (id,item,remark) VALUES (?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(
      queryString,
      ["DEFAULT", item, remark],
      (err, rows, fields) => {
        if (err) {
          throw err;
        } else {
          connection.release();
          res.end("ok");
        }
      }
    );
  });
};

/**
 * Delete grocery list database
 */
exports.resetGrocery = cb => {
  const queryString = "DELETE FROM `grocery`";

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        connection.release();
        cb();
      }
    });
  });
};

/**
 * Get grocery list from database
 */
exports.getGrocery = cb => {
  const queryString = "SELECT * FROM `grocery`";

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        connection.release();
        cb(rows);
      }
    });
  });
};

/**
 * CRON JOB FUNCTIONALITY
 * Shift the cook schedule every day
 */
exports.shiftSchedule = res => {
  //   MYSQL QUERY - Select the lowest sequence in database and add the value with +1 from last row
  const queryString =
    "UPDATE Cook SET sequence = ((SELECT sequence FROM (SELECT * FROM Cook)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE user_id = (SELECT user_id FROM (SELECT * FROM Cook LIMIT 1)  AS temp) ORDER BY sequence ASC LIMIT 1";
  const queryString2 = "DELETE FROM cron WHERE job = 'cook'";

  const queryString3 = "SELECT * FROM `cook` LIMIT 1";
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
                  ["DEFAULT", rows[0].user_id, "cook", 0],
                  (err4, rows4, fields4) => {
                    if (err4) {
                      throw err4;
                    } else {
                      connection.release();
                      res.end("ok");
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
};

/**
 * CRON JOB FUNCTIONALITY
 * Send reminder to cook
 */

exports.cookReminder = res => {
  const queryString = "SELECT * FROM cron WHERE job = 'cook'";
  const queryString2 = "SELECT status FROM `cron` WHERE user_id = ?";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        console.log(rows);
        connection.query(
          queryString2,
          [rows[0].user_id],
          (err2, rows2, field2) => {
            if (err2) {
              throw err2;
            } else if (rows2[0].status == 0) {
              var inlineKeyboard = [
                [
                  {
                    text: "Yes",
                    callback_data: "CYes"
                  },
                  {
                    text: "No",
                    callback_data: "CNo"
                  }
                ]
              ];

              Message.sendMessage(
                rows[0].user_id,
                "!! REMINDER !!\nHave you cook for today ?",
                { inline_keyboard: inlineKeyboard },
                res
              );
            } else {
              connection.release();
              res.end("ok");
            }
          }
        );
      }
    });
  });
};
