const mysql = require("mysql");
const config = require("../config");
const pool = mysql.createPool(config);

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
