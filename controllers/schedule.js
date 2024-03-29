const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

/**
 * Add user to cook schedule database
 */
exports.addCookSchedule = (username, res) => {
  const queryString = "SELECT * FROM Cook ORDER BY sequence DESC LIMIT 1";
  const queryString2 =
    "INSERT INTO `cook` (sequence,user_id,username) SELECT 1,user_id,username FROM users WHERE username = ?";
  const queryString3 =
    "INSERT INTO `cook` (sequence,user_id,username) SELECT ?,user_id,username FROM users WHERE username = ?";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length == 0) {
        connection.query(queryString2, [username], (err2, rows2, fields2) => {
          if (err) throw err;
          else {
            connection.release();
            res.end("ok");
          }
        });
      } else {
        connection.query(
          queryString3,
          [rows[0].sequence + 1, username],
          (err2, rows2, fields2) => {
            if (err) throw err;
            else {
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
exports.addDishSchedule = (username, res) => {
  const queryString = "SELECT * FROM dish ORDER BY sequence DESC LIMIT 1";
  const queryString2 =
    "INSERT INTO `dish` (sequence,user_id,username) SELECT 1,user_id,username FROM users WHERE username = ?";
  const queryString3 =
    "INSERT INTO `dish` (sequence,user_id,username) SELECT ?,user_id,username FROM users WHERE username = ?";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length == 0) {
        connection.query(queryString2, [username], (err2, rows2, fields2) => {
          if (err) throw err;
          else {
            connection.release();
            res.end("ok");
          }
        });
      } else {
        connection.query(
          queryString3,
          [rows[0].sequence + 1, username],
          (err2, rows2, fields2) => {
            if (err) throw err;
            else {
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
exports.addTrashSchedule = (username, res) => {
  const queryString = "SELECT * FROM trash ORDER BY sequence DESC LIMIT 1";
  const queryString2 =
    "INSERT INTO `trash` (sequence,user_id,username) SELECT 1,user_id,username FROM users WHERE username = ?";
  const queryString3 =
    "INSERT INTO `trash` (sequence,user_id,username) SELECT ?,user_id,username FROM users WHERE username = ?";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length == 0) {
        connection.query(queryString2, [username], (err2, rows2, fields2) => {
          if (err) throw err;
          else {
            connection.release();
            res.end("ok");
          }
        });
      } else {
        connection.query(
          queryString3,
          [rows[0].sequence + 1, username],
          (err2, rows2, fields2) => {
            if (err) throw err;
            else {
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
exports.addCleanSchedule = (username, res) => {
  const queryString = "SELECT * FROM clean ORDER BY sequence DESC LIMIT 1";
  const queryString2 =
    "INSERT INTO `clean` (sequence,user_id,username) SELECT 1,user_id,username FROM users WHERE username = ?";
  const queryString3 =
    "INSERT INTO `clean` (sequence,user_id,username) SELECT ?,user_id,username FROM users WHERE username = ?";

  pool.getConnection(function(err, connection) {
    if (err) throw err;

    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length == 0) {
        connection.query(queryString2, [username], (err2, rows2, fields2) => {
          if (err) throw err;
          else {
            connection.release();
            res.end("ok");
          }
        });
      } else {
        connection.query(
          queryString3,
          [rows[0].sequence + 1, username],
          (err2, rows2, fields2) => {
            if (err) throw err;
            else {
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
exports.swapCookSchedule = (cbQuery, res) => {
  const queryString = "SELECT * FROM cook ORDER BY sequence ASC";
  const queryString2 = "UPDATE cook SET sequence = ? WHERE id = ?";
  const queryString3 =
    "UPDATE cron SET user_id = ?, username = ?, status= 0 WHERE job = 'cook'";

  const to = parseInt(cbQuery.data[1] - 1, 10);
  const from = parseInt(cbQuery.data[2] - 1, 10);

  console.log("FROM TO", from, to);
  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [], (err, rows, fields) => {
      if (err) throw err;
      else {
        connection.query(
          queryString2,
          [rows[from].sequence, rows[to].id],
          (err2, rows2, fields2) => {
            if (err2) throw err2;
            else {
              connection.query(
                queryString2,
                [rows[to].sequence, rows[from].id],
                (err3, rows3, fields3) => {
                  if (err3) throw err3;
                  else {
                    if (from == 0 || to == 0) {
                      connection.query(queryString, [], (err, rows, fields) => {
                        if (err) throw err;
                        else {
                          console.log(rows);
                          connection.query(
                            queryString3,
                            [rows[0].user_id, rows[0].username],
                            (err3, rows3, fields3) => {
                              if (err3) {
                                throw err3;
                              } else {
                                connection.release();
                                res.end("ok");
                              }
                            }
                          );
                        }
                      });
                    } else {
                      connection.release();
                      res.end("ok");
                    }
                  }
                }
              );
            }
          }
        );
      }
    });
  });
};
