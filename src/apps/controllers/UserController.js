const Users = require("../models/Users");
class UserController {
  //Create user
  async create(req, res) {
    /**
     * Verifica se existe usuario cadastrado com mesmo email
     */
    const verifyUser = await Users.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (verifyUser) {
      return res.status(400).json({ message: "User already exists!" });
    }
    const user = await Users.create(req.body);
    if (!user) {
      return res.status(400).json({ message: "Failed to create an User! " });
    }
    return res.status(201).send({ message: "User created" });
  }
}

module.exports = new UserController();
