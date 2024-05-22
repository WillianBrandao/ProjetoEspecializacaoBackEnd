const { Router } = require("express");
const schemaValidator = require("./apps/middlewares/schemaValidator");

const AuthenticationMiddleware = require("./apps/middlewares/authentication");

const AuthenticationController = require("./apps/controllers/AuthenticationController");
const authSchema = require("./schema/auth.schema.json");

const UserController = require("./apps/controllers/UserController");
const userSchema = require("./schema/create.user.schema.json");

routes = new Router();

routes.get("/verify", (req, res) => {
  return res.send({ message: "Connected with sucess!" });
});

//Create user
routes.post("/user", schemaValidator(userSchema), UserController.create);
routes.post(
  "/auth",
  schemaValidator(authSchema),
  AuthenticationController.authenticate
);

routes.use(AuthenticationMiddleware);
routes.get("/verify/auth", (req, res) => {
  return res.send({ message: "Connected with sucess!" });
});

//Update user
routes.put("/user",UserController.update);

module.exports = routes;
