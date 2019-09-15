const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);
var Message = require("../message.js");

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
