const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const { encrypt } = require("../../utils/crypt");
const crypto = require("crypto");
const mailer = require("../../modules/mailer");
const bcryptjs = require("bcryptjs");
const { where } = require("sequelize");

class AuthenticationController {
  async authenticate(req, res) {
    const { email, password } = req.body;

    const whereClause = {};
    if (email) {
      whereClause.email = email;
    } else {
      return res.status(400).json({ error: "We need an e-mail or password" });
    }
    const user = await Users.findOne({
      where: whereClause,
    });

    if (!user) {
      return res.status(400).json({ error: "User not found!" });
    }
    //Veriica se o password é igual ao password usado para o hash
    if (!(await user.checkPassword(password))) {
      return res.status(400).json({ error: "Password does not match!" });
    }

    const { id, email: userEmail } = user;

    const { iv, content } = encrypt(id);

    const newId = `${iv}:${content}`;

    const token = jwt.sign({ userId: newId }, process.env.HASH_BCRYPT, {
      expiresIn: process.env.EXPIRE_IN,
    });

    return res.status(200).json({ user: { id, email: userEmail }, token });
  }
  //Rota para enviar email com token
  async forgotPassword(req, res) {
    const { email } = req.body;

    try {
      const user = await Users.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(400).json({ error: "User not found!" });
      }

      const token = crypto.randomBytes(20).toString("hex");
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const name = user.name;

      await Users.update(
        {
          // se vazio atualiza com o antigo
          password_reset_token: token,
          password_reset_expires: now,
        },
        {
          where: {
            email: user.email,
          },
        }
      );
      mailer.sendMail(
        {
          to: email,
          from: process.env.EMAIL_REMETENTE,
          subject: "Redefinição de senha aplicação BackEND",
          template: "auth/forgot_password",
          context: { token, name },
        },
        (err) => {
          if (err) {
            console.log(err);
            return res
              .status(400)
              .send({ error: "Cannot send forgot password email" });
          }
          return res
            .status(200)
            .send({ message: "Email enviado com sucesso!" });
        }
      );
    } catch (err) {
      res.status(400).send({ error: "Erro on forgot password, try again!" });
    }
  }

  //Resetar password
  async resetPassword(req, res) {
    const { email, token, password } = req.body; //Mudar para params o token?
    try {
      const user = await Users.findOne({
        where: {
          email: email,
        },
      });

      if (!user) {
        return res.status(400).json({ error: "User not found!" });
      }

      if (token !== user.password_reset_token) {
        return res.status(400).json({ error: "Token invalid!" });
      }

      const dateNow = new Date();
      if (dateNow > user.password_reset_expires) {
        return res.status(400).json({
          error: "Token already expires. Please generate a new token!",
        });
      }
      const new_password = await bcryptjs.hash(password, 8);

      await Users.update(
        { password_hash: new_password },
        { where: { email: email } }
      );
      return res
        .status(200)
        .send({ message: "Password was changed successfully" });
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "Cannot reset password, try again!" });
    }
  }
}

module.exports = new AuthenticationController();
