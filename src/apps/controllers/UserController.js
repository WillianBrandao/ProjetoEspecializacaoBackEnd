const Users = require("../models/Users");
const bcryptjs = require("bcryptjs"); //Usado em update user
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

  //Update User
  async update(req, res) {
    const { name, old_password, new_password, confirm_new_password } = req.body;
    console.log(req.userId);

    const user = await Users.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not exists!" });
    }

    let encryptedPassword = "";
    // Verifica se possui o old password, assim quer dizer q se deseja definir um novo
    if (old_password) {
      // Verifica se o password antigo confere com o registrado no sistema
      if (!(await user.checkPassword(old_password))) {
        return res.status(401).json({ error: "Old password does not match!" });
      }
      //Verifica se os campos de password e verificacao nao estao vazios
      if (!new_password || !confirm_new_password) {
        return res.status(401).json({
          error: "We need a new password and confirm new password attributes",
        });
      }
      // Verifica similaridade dos senhas
      if (new_password !== confirm_new_password) {
        return res.status(401).json({
          error: "New password and confirm new password does not match!",
        });
      }
      encryptedPassword = await bcryptjs.hash(new_password, 8);
    }
    //atualiza as informacoes
    await Users.update(
      {
        // se vazio atualiza com o antigo
        name: name || user.name,
        password_hash: encryptedPassword || user.password_hash,
      },
      {
        where: {
          id: user.id,
        },
      }
    );
    return res.status(201).json({ message: "User Updated!" });
  }

  //Delete User
  async delete(req, res) {
    const userToDelete = await Users.findOne({
      where: {
        id: req.userId,
      },
    });

    if (!userToDelete) {
      return res.status(400).json({ message: "User not exists!" });
    }

    await Users.destroy({
      where: {
        id: req.userId,
      },
    });

    return res.status(200).json({ message: "User deleted! " });
  }
  //User information (get)
  async userProfile(req, res) {
    const user = await Users.findOne({
      attributes: ["id", "name", "email"],
      where: {
        id: req.userId,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "User not exists!" });
    }

    const { id, name, email } = user;
    return res.status(200).json({
      id,
      name,
      email,
    });
  }
}

module.exports = new UserController();
