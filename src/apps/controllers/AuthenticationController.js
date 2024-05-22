const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const { encrypt } = require("../../utils/crypt");

class AuthenticationController {
  async authenticate(req, res) {
    const { email, password } = req.body;

    const whereClause = {};
    if (email) {
      whereClause.email = email;
    } else {
      return res.status(401).json({ error: "We need an e-mail or password" });
    }
    const user = await Users.findOne({
      where: whereClause,
    });

    if (!user) {
      return res.status(401).json({ error: "User not found!" });
    }
    //Veriica se o password é igual ao password usado para o hash
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: "Password does not match!" });
    }

    const { id, email: userEmail } = user;

    const { iv, content } = encrypt(id);

    const newId = `${iv}:${content}`;

    const token = jwt.sign({ userId: newId }, process.env.HASH_BCRYPT, {
      expiresIn: process.env.EXPIRE_IN,
    });

    return res.status(200).json({ user: { id, email: userEmail }, token });
  }
}

module.exports = new AuthenticationController();