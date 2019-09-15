const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

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
