require("dotenv").config();
const Sequelize = require("sequelize");
const { Model } = require("sequelize");

class Topics extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        revision_in: Sequelize.VIRTUAL,
        user_id: Sequelize.INTEGER,
        revision_at: Sequelize.DATEONLY,
      },
      {
        sequelize,
      }
    );

    this.addHook("beforeSave", async (topic) => {
      const now = new Date();
      now.setDate(
        now.getDate() +
          (topic.revision_in || parseInt(process.env.DIAS_PADRAO_PARA_REVISAO))
      );
      topic.revision_at = now;
    });
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: "user_id", as: "user" });
  }
}

module.exports = Topics;
