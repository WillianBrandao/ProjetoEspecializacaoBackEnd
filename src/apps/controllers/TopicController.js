require("dotenv").config();
const Topics = require("../models/Topics");
const Users = require("../models/Users");
const { Op } = require("sequelize");

class TopicController {
  //Create Topic
  async create(req, res) {
    const { description, revision_in } = req.body;
    try {
      const verifyTopicDescription = await Topics.findOne({
        where: {
          description: description,
          user_id: req.userId,
        },
      });

      if (verifyTopicDescription) {
        return res.status(400).json({ message: "Topic already exists!" });
      }

      const newTopic = await Topics.create({
        description,
        user_id: req.userId,
        revision_in,
      });

      if (!newTopic) {
        return res.status(400).json({ message: "Created topic failed" });
      }

      return res.status(200).json({ data: { description, revision_in } });
    } catch (err) {
      return res.status(500).json({ error: "Falha no servidor!" });
    }
  }

  //Delete Topic
  async delete(req, res) {
    const { id } = req.params;

    try {
      //verifica se Topic pertence ao usuario logado
      const verifyTopic = await Topics.findOne({
        where: {
          id: id,
        },
      });

      if (!verifyTopic) {
        return res.status(404).json({ message: "Topic does not exists!" });
      }
      if (verifyTopic.user_id !== req.userId) {
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
    } catch (err) {
      return res.status(500).json({ error: "Falha no servidor!" });
    }
  }

  //Update Topic
  async update(req, res) {
    const { id } = req.params;
    const { description, revision_in } = req.body;

    try {
      //verifica se Topic pertence ao usuario logado
      const verifyTopic = await Topics.findOne({
        where: {
          id: id,
        },
      });

      if (!verifyTopic) {
        return res.status(404).json({ message: "Topic does not exists!" });
      }
      if (verifyTopic.user_id !== req.userId) {
        return res
          .status(401)
          .json({ message: "You don`t have permission to update this topic!" });
      }

      if (description) {
        const verifyDescription = await Topics.findOne({
          where: {
            description: description,
            user_id: req.userId,
          },
        });

        if (verifyDescription) {
          return res.status(400).json({ message: "Topic already exists!" });
        }
      }

      //Modifica a data de revision_at
      const daysForRevision = new Date();
      daysForRevision.setDate(
        daysForRevision.getDate() +
          (revision_in || parseInt(process.env.DIAS_PADRAO_PARA_REVISAO))
      );
      req.body.revision_at = daysForRevision;

      const TopicUpdate = await Topics.update(req.body, { where: { id } });
      if (!TopicUpdate) {
        return res.status(404).json({ message: "Failed to update this topic" });
      }

      return res.status(200).json({ message: "Topic updated!" });
    } catch (err) {
      return res.status(500).json({ error: "Falha no servidor!" });
    }
  }

  //list all users topics
  async listMyTopics(req, res) {
    try {
      const myTopics = await Topics.findAll({
        where: {
          user_id: req.userId,
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
    } catch (err) {
      return res.status(500).json({ error: "Falha no servidor!" });
    }
  }

  //list topics by date
  async listMyDelayedTopics(req, res) {
    const today = new Date();
    try {
      const delayedTopics = await Topics.findAll({
        where: {
          revision_at: { [Op.lt]: today },
        },
        order: [["revision_at", "ASC"]],
      });
      const formattedData = [];
      for (const topic of delayedTopics) {
        formattedData.push({
          id: topic.id,
          description: topic.description,
          revision_at: topic.revision_at,
        });
      }
      return res.status(200).json({ data: formattedData });
    } catch (err) {
      return res.status(500).json({ error: "Falha no servidor!" });
    }
  }
  //Listar todos os topicos
  async listAllTopics(req, res) {
    try {
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
    } catch (err) {
      return res.status(500).json({ error: "Falha no servidor!" });
    }
  }
}

module.exports = new TopicController();
