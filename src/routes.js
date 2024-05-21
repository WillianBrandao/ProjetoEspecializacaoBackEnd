const { Router } = require("express");

routes = new Router();

routes.get("/verify", (req, res) => {
  return res.send({ message: "Connected with sucess!" });
});

module.exports = routes;
