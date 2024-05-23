const Sequelize = require("sequelize");
const { Model } = require("sequelize");
const moment = require("moment");

class Topics extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        revision_in: Sequelize.VIRTUAL,
        revision_owner: Sequelize.INTEGER,
        revision_at: Sequelize.DATEONLY,
      },
      {
        sequelize,
      }
    );
    this.addHook("beforeSave", async (topic) => {
      if (topic.revision_in) {
        const updatedAt = moment(topic.updated_at);
        const revisionDate = updatedAt.add(topic.revision_in, "days");
        topic.revision_at = revisionDate.toDate();
      } else {
        const updatedAt = moment(topic.updated_at);
        const revisionDate = updatedAt.add(7, "days");
        topic.revision_at = revisionDate.toDate();
      }
    });
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: "revision_owner", as: "user" });
  }
}

module.exports = Topics;
