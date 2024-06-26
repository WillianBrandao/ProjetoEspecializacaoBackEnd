const { Router } = require("express");
const schemaValidator = require("./apps/middlewares/schemaValidator");

const AuthenticationMiddleware = require("./apps/middlewares/authentication");

const AuthenticationController = require("./apps/controllers/AuthenticationController");
const authSchema = require("./schema/auth.schema.json");

const UserController = require("./apps/controllers/UserController");
const userSchema = require("./schema/create.user.schema.json");

const TopicController = require("./apps/controllers/TopicController");
const topicSchema = require("./schema/create.topic.schema.json");
const topicUpdateSchema = require("./schema/update.topic.schema.json");

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

//Esqueci minha senha
routes.post("/auth/forgot-password", AuthenticationController.forgotPassword);

//Recuperar senha
routes.post("/auth/reset-password", AuthenticationController.resetPassword);

routes.use(AuthenticationMiddleware);


routes.get("/verify/auth", (req, res) => {
  return res.send({ message: "Connected with sucess!" });
});

//Update user
routes.put("/user", UserController.update);

//Delete User
routes.delete("/user", UserController.delete);

//Get information user
routes.get("/user", UserController.userProfile);

//Topics
//Create topic
routes.post("/topic", schemaValidator(topicSchema), TopicController.create);

//Delete topic
routes.delete("/topic/:id", TopicController.delete);

//Update Topic
routes.put(
  "/topic/:id",
  schemaValidator(topicUpdateSchema),
  TopicController.update
);

//List all users topics
routes.get("/my-topics",TopicController.listMyTopics);

//List only today and delayed topics
routes.get("/topic/delayed",TopicController.listMyDelayedTopics)

//Listar todos os topicos
routes.get("/all-topics",TopicController.listAllTopics)



module.exports = routes;
