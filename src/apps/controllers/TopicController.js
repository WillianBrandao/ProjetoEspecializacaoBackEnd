const Topics = require("../models/Topics");
const moment = require("moment");

class TopicController {
  //Create Topic
  async create(req, res) {
    const { description, revision_in } = req.body;

    const newTopic = await Topics.create({
      description,
      revision_owner: req.userId,
      revision_in,
    });

    if (!newTopic) {
      return res.status(400).json({ message: "Created topic failed" });
    }

    return res.status(200).json({ data: { description, revision_in } });
  }

  //Delete Topic
  async delete(req, res) {
    const { id } = req.params;

    //verifica se Topic pertence ao usuario logado
    const verifyTopic = await Topics.findOne({
      where: {
        id: id,
      },
    });

    if (!verifyTopic) {
      return res.status(404).json({ message: "Topic does not exists!" });
    }
    if (verifyTopic.revision_owner !== req.userId) {
      return res
        .status(401)
        .json({ message: "You don`t have permission to delete this topic!" });
    }
    const deleteTopic = await Topics.destroy({
      where: {
        id,
      },
    });
    if (!deleteTopic) {
      return res.status(404).json({ message: "Failed to delete this topic" });
    }
    return res.status(200).json({ message: "Topic deleted" });
  }

  //Update Topic
  async update(req, res) {
    const { id } = req.params;
    const { description, revision_in } = req.body;
    //verifica se Topic pertence ao usuario logado
    const verifyTopic = await Topics.findOne({
      where: {
        id: id,
      },
    });

    if (!verifyTopic) {
      return res.status(404).json({ message: "Topic does not exists!" });
    }
    if (verifyTopic.revision_owner !== req.userId) {
      return res
        .status(401)
        .json({ message: "You don`t have permission to delete this topic!" });
    }
    // Define o número de dias para a revisão
    const daysForRevision = revision_in || 7;

    // Calcula a nova data de revisão usando moment.js
    const updatedAt = moment(verifyTopic.updated_at);
    const revisionDate = updatedAt.add(daysForRevision, "days");

    // Atualiza o campo revision_at com a nova data de revisão
    req.body.revision_at = revisionDate.toDate();

    const TopicUpdate = await Topics.update(req.body, { where: { id } });
    if (!TopicUpdate) {
      return res.status(404).json({ message: "Failed to update this topic" });
    }

    return res.status(200).json({ message: "Topic updated!" });
  }

  //list all users topics
  async listMyTopics(req, res) {
    const myTopics = await Topics.findAll({
      where: {
        revision_owner: req.userId,
      },
      order: [["revision_at", "ASC"]],
    });

    if (!myTopics) {
      return res.status(400).json({ message: "Failed to list my topics!" });
    }
    const formattedData = [];
    for (const topic of myTopics) {
      formattedData.push({
        id: topic.id,
        description: topic.description,
        revision_at: topic.revision_at,
      });
    }

    return res.status(200).json({ data: formattedData });
  }
}

module.exports = new TopicController();
