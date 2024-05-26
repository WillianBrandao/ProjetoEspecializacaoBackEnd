const Topics = require("../models/Topics");
const Users = require("../models/Users");
const moment = require("moment");
const { Op } = require("sequelize");

class TopicController {
  //Create Topic
  async create(req, res) {
    const { description, revision_in } = req.body;

    const verifyTopicDescription = await Topics.findOne({
      where: {
        description: description,
      },
    });

    if (verifyTopicDescription) {
      return res.status(400).json({ message: "Topic already exists!" });
    }

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

    if (description) {
      const verifyDescription = await Topics.findOne({
        where: {
          description: description,
        },
      });

      if (verifyDescription) {
        return res.status(400).json({ message: "Topic already exists!" });
      }
    }

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
        .json({ message: "You don`t have permission to update this topic!" });
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
        description: topic.description,
        revision_at: topic.revision_at,
      });
    }

    return res.status(200).json({ data: formattedData });
  }

  //list topics by date
  async listMyDelayedTopics(req, res) {
    const today = new Date();
    const delayedTopics = await Topics.findAll({
      where: {
        revision_at: { [Op.lt]: today },
      },
      order: [["revision_at", "ASC"]],
    });
    const formattedData = [];
    for (const topic of delayedTopics) {
      formattedData.push({
        description: topic.description,
        revision_at: topic.revision_at,
      });
    }
    return res.status(200).json({ data: formattedData });
  }
  //Listar todos os topicos
  async listAllTopics(req, res) {
    const allTopics = await Topics.findAll({
      order: [["revision_at", "DESC"]],
      attributes: ["description", "revision_at"],
      include: [
        {
          model: Users,
          as: "user",
          required: true,
          attributes: ["name"],
        },
      ],
    });

    return res.status(200).json({ data: allTopics });
  }
}



module.exports = new TopicController();
