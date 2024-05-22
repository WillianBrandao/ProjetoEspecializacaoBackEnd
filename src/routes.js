const { Router } = require("express");
const schemaValidator = require("./apps/middlewares/schemaValidator");

const UserController = require("./apps/controllers/UserController");
const userSchema = require("./schema/create.user.schema.json");

routes = new Router();

routes.get("/verify", (req, res) => {
  return res.send({ message: "Connected with sucess!" });
});

//Create user
routes.post("/user", schemaValidator(userSchema), UserController.create);

module.exports = routes;
