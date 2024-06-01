const Sequelize = require("sequelize");
const { Model } = require("sequelize");
const bcryptjs = require("bcryptjs");
const { password } = require("../../configs/db");

class Users extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
        password_hash: Sequelize.STRING,
        password_reset_token: Sequelize.STRING,
        password_reset_expires: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcryptjs.hash(user.password, 8);
      }
    });

    return this;
  }
  /**
   * Usado no Authentication controller para verificar se o password está correto
   * @param {*} password_hash
   * @returns
   */
  checkPassword(password) {
    return bcryptjs.compare(password, this.password_hash);
  }
  static associate(models) {
    this.hasMany(models.Topics, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

module.exports = Users;
