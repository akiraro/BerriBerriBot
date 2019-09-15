const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

var Message = require("../message.js");

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

/**
 * CRON JOB FUNCTIONALITY
 * Shift the cook schedule every day
 */
exports.shiftSchedule = res => {
  /**
   * queryString -> Shift the first user in cook schedule to be the last
   * queryString2 -> Delete the cron job for cook
   * queryString3 -> Get the next user for cook
   * queryString4 -> Add the user into cron
   */
  const queryString =
    "UPDATE Cook SET sequence = ((SELECT sequence FROM (SELECT * FROM Cook)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE user_id = (SELECT user_id FROM (SELECT * FROM Cook LIMIT 1)  AS temp) ORDER BY sequence ASC LIMIT 1";
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
