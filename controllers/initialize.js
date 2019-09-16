const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

/**
 * Initialization of database
 */
exports.initialize = (res, cb) => {
  console.log("RUNNING INIT");
  const queryString = "SELECT * FROM `cook` ORDER BY sequence ASC LIMIT 1";
  const queryString2 = "SELECT * FROM `clean` ORDER BY sequence ASC LIMIT 1";
  const queryString3 = "SELECT * FROM `trash` ORDER BY sequence ASC LIMIT 1";
  const queryString4 = "SELECT * FROM `dish` ORDER BY sequence ASC LIMIT 1";
  const queryStringXX =
    "INSERT INTO `cron` (`id`,`user_id`,`job`,`status`) VALUES (?,?,?,?)";

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length != 0) {
        connection.query(
          queryStringXX,
          ["DEFAULT", rows[0].user_id, "cook", 0],
          (errXX, rowsXX, fieldsXX) => {
            if (errXX) {
              console.log(errXX);
              connection.release();
              res.end();
            } else {
              connection.release();
            }
          }
        );
      }
    });
  });

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString2, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length != 0) {
        connection.query(
          queryStringXX,
          ["DEFAULT", rows[0].user_id, "clean", 0],
          (errXX, rowsXX, fieldsXX) => {
            if (errXX) {
              console.log(errXX);
              connection.release();
              res.end();
            } else {
              connection.release();
            }
          }
        );
      }
    });
  });

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString3, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length != 0) {
        connection.query(
          queryStringXX,
          ["DEFAULT", rows[0].user_id, "trash", 0],
          (errXX, rowsXX, fieldsXX) => {
            if (errXX) {
              console.log(errXX);
              connection.release();
              res.end();
            } else {
              connection.release();
            }
          }
        );
      }
    });
  });

  pool.getConnection(function(err, connection) {
    if (err) throw err;
    connection.query(queryString4, [], (err, rows, fields) => {
      if (err) {
        throw err;
      } else if (rows.length != 0) {
        connection.query(
          queryStringXX,
          ["DEFAULT", rows[0].user_id, "dish", 0],
          (errXX, rowsXX, fieldsXX) => {
            if (errXX) {
              console.log(errXX);
              connection.release();
              res.end();
            } else {
              connection.release();
            }
          }
        );
      }
    });
  });
  cb();
};
