const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();
const hbs = require("nodemailer-express-handlebars");

const transport = nodemailer.createTransport({
  host: process.env.MAILERTRAP_HOST,
  port: process.env.MAILERTRAP_PORT,
  auth: {
    user: process.env.MAILERTRAP_USER,
    pass: process.env.MAILERTRAP_SENHA,
  },
});

transport.use(
  "compile",
  hbs({
    viewEngine: {
      defaultLayout: undefined,
      partialsDir: path.resolve("./src/resources/mail/"),
    },
    viewPath: path.resolve("./src/resources/mail/"),
    extName: ".html",
  })
);

module.exports = transport;
