require("dotenv").config();
module.exports = {
  dialect: process.env.MYSQL_DIALECT,
  host: process.env.MYSQL_HOST,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_DB_PORT,
  timezone: process.env.MYSQL_TIMEZONE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
