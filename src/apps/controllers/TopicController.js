const Topics = require("../models/Topics");

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
}

module.exports = new TopicController();
