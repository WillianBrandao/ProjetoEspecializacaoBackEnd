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
    res.send({ users: "teste" });
  }
}

module.exports = new UserController();
