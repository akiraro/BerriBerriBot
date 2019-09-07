const mysql = require("mysql");
const config = require("./config");
const connection = mysql.createConnection(config);

exports.registerUser = (id, username, res) => {
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
        connection.destroy();
        res.end();
      }
    }
  );
};
