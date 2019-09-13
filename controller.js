const mysql = require("mysql");
const config = require("./config");
const connection = mysql.createConnection(config);

exports.registerUser = (id, username, res) => {
  connection.connect();
  const queryString =
    "INSERT INTO `Users` (`id`,`user_id`,`username`) VALUES (?,?,?)";

  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });

  connection.query(
    queryString,
    ["DEFAULT", id, username],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
        res.end();
      } else {
        console.log("SUCCESS : USER REGISTERED");
        res.end();
      }
    }
  );
};

exports.checkRegistered = (user_id, cb) => {
  connection.connect();
  const queryString = "SELECT username FROM Users WHERE `user_id` = ?";

  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });

  connection.query(queryString, [user_id], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else if (rows.length != 0) {
      console.log("SUCCESS : USER FOUND");

      cb(true);
    } else {
      cb(false);
    }
  });
};

exports.getUsers = cb => {
  connection.connect();
  const queryString = "SELECT * FROM Users";

  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });

  connection.query(queryString, [], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else if (rows.length != 0) {
      console.log("SUCCESS : USER FOUND");
      console.log(rows);
      cb(rows);
    } else {
    }
  });
};

exports.addCookSchedule = (user_id, username, res) => {
  connection.connect();
  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });

  const queryString = "SELECT * FROM Cook ORDER BY sequence DESC LIMIT 1";
  const queryString2 =
    "INSERT INTO `Cook` (sequence,user_id,username) VALUES (?,?,?)";

  connection.query(queryString, [], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      connection.query(
        queryString2,
        [rows[0].sequence + 1, user_id, username],
        (err2, rows2, fields2) => {
          if (err) {
            console.log(err);
          } else {
            res.end("ok");
          }
        }
      );
    }
  });
};

exports.getCookSchedule = cb => {
  connection.connect();
  const queryString = "SELECT * FROM Cook ORDER BY sequence ASC";

  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });

  connection.query(queryString, [], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      cb(rows);
    }
  });
};

exports.shiftSchedule = res => {
  connection.connect();
  //   MYSQL QUERY - Select the lowest sequence in database and add the value with +1 from last row
  const queryString =
    "UPDATE Cook SET sequence = ((SELECT sequence FROM (SELECT * FROM Cook)  AS temp3 ORDER BY sequence DESC LIMIT 1) + 1)  WHERE user_id = (SELECT user_id FROM (SELECT * FROM Cook LIMIT 1)  AS temp) ORDER BY sequence ASC LIMIT 1";

  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });

  connection.query(queryString, [], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      res.end("ok");
    }
  });
};

exports.swapCookSchedule = (user_id, cbQuery, res) => {
  connection.connect();
  const queryString = "SELECT sequence FROM cook WHERE user_id IN (?,?)";
  const queryString2 = "UPDATE cook SET sequence = ? WHERE user_id = ?";
  const queryString3 = "UPDATE cook SET sequence = ? WHERE user_id = ?";

  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });
  connection.query(
    queryString,
    [user_id, cbQuery.data.slice(1, cbQuery.data.length)],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
      } else {
        connection.query(
          queryString2,
          [rows[0].sequence, cbQuery.data.slice(1, cbQuery.data.length)],
          (err2, rows2, fields2) => {
            if (err2) {
              console.log(err2);
            } else {
              connection.query(
                queryString3,
                [rows[1].sequence, user_id],
                (err3, rows3, fields3) => {
                  if (err3) {
                    console.log(err3);
                  } else {
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
};

exports.addGroceryList = (item, remark, res) => {
  connection.connect();
  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });

  const queryString = "INSERT INTO `grocery` (id,item,remark) VALUES (?,?,?)";

  connection.query(
    queryString,
    ["DEFAULT", item, remark],
    (err, rows, fields) => {
      if (err) {
        console.log(err);
      } else {
        res.end("ok");
      }
    }
  );
};

exports.resetGrocery = cb => {
  connection.connect();
  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });

  const queryString = "DELETE FROM `grocery`";

  connection.query(queryString, [], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      cb();
    }
  });
};

exports.getGrocery = cb => {
  connection.connect();
  connection.on("error", function(err) {
    console.log("Caught this error: " + err);
  });

  const queryString = "SELECT * FROM `grocery`";

  connection.query(queryString, [], (err, rows, fields) => {
    if (err) {
      console.log(err);
    } else {
      cb(rows);
    }
  });
};
