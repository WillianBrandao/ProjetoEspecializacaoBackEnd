const Sequelize = require("sequelize");
const { Model } = require("sequelize");

class Topics extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
        revision_in: Sequelize.VIRTUAL,
        revision_owner: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    this.addHook("beforeSave", async (topic) => {
      if (topic.revision_in) {
        const updatedAt = topic.updated_at;
        const revisionIn = topic.revision_in;
        const revisionDate = new Date(updatedAt);
        revisionDate.setDate(revisionDate.getDate() + revisionIn);
        topic.revision_at = revisionDate;
      } else {
        const updatedAt = topic.updated_at;
        const revisionDate = new Date(updatedAt);
        revisionDate.setDate(revisionDate.getDate() + 7);
        topic.revision_at = revisionDate;
      }
    });
    return this;
  }
  static associate(models) {
    this.belongsTo(models.Users, { foreignKey: "revision_owner", as: "user" });
  }
}

module.exports = Topics;
