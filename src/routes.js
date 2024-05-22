const { Router } = require("express");

const UserController = require("./apps/controllers/UserController");

routes = new Router();

routes.get("/verify", (req, res) => {
  return res.send({ message: "Connected with sucess!" });
});

//Create user
routes.post("/user", UserController.create);

module.exports = routes;
