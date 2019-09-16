const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

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
 * Get status of all cron jobs
 */
exports.getStatus = cb => {
  const queryString = "SELECT * FROM cron";

  var message = "-- RUE BERRI CHORES --\n";
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else {
        for (var i = 0; i < rows.length; i++) {
          if (rows[i].status == 0) {
            message =
              message + rows[i].job.toUpperCase() + "\t \u{274C}" + "\n";
          } else {
            message =
              message + rows[i].job.toUpperCase() + "\t \u{2705}" + "\n";
          }
        }
        cb(message);
        connection.release();
      }
    });
  });
};
