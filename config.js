let config = {
  host: process.env.RDS_HOST || "us-cdbr-iron-east-02.cleardb.net",
  port: process.env.RDS_PORT || 3306,
  user: process.env.RDS_USER || "bf06aff5ce1be3",
  password: process.env.RDS_PASS || "7a7c4568",
  database: process.env.RDS_DATABASE || "heroku_551806cb4e4349a"
};

module.exports = config;
