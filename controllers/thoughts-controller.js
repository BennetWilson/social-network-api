const { Thoughts, Users } = require("../models");

const thoughtsController = {
  createThoughts({ params, body }, res) {
    Thoughts.create(body)
      .then(({ _id }) => {
        return Users.findOneAndUpdate(
          { _id: params.userId },
          { $push: { thoughts: _id } },
          { new: true }
        );
      })
      .then((dbThoughtsData) => {
        !dbThoughtsData
          ? res.status(400).json({ message: "No thoughts with that ID" })
          : res.json(dbThoughtsData);
      })
      .catch((err) => res.json(err));
  },

  getAllThoughts(req, res) {
    Thoughts.find({})
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtsData) => {
        res.json(dbThoughtsData);
      })
      .catch((err) => console.log(err).res.status(500).json(err));
  },

  getThoughtsById({ params }, res) {
    Thoughts.findOne({ _id: params.id })
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtsData) => {
        !dbThoughtsData
          ? res.status(404).json({ message: "No Thought found with this id" })
          : res.json(dbThoughtsData);
      })
      .catch((err) => console.log(err).res.sendStatus(400));
  },

  updateThoughts({ params, body }, res) {
    Thoughts.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtsData) => {
        !dbThoughtsData
          ? res.status(404).json({ message: "No Thought Found With This ID" })
          : res.json(dbThoughtsData);
      })
      .catch((err) => res.json(err));
  },

  deleteThoughts({ params }, res) {
    Thoughts.findOneAndDelete({ _id: params.id })
      .then((dbThoughtsData) => {
        !dbThoughtsData
          ? res.status(400).json({ message: "No Thought Found With That ID" })
          : res.json(dbThoughtsData);
      })
      .catch((err) => res.status(400).json(err));
  },

  addReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body } },
      { new: true, runValidators: true }
    )
      .populate({ path: "reactions", select: "-__v" })
      .select("-__v")
      .then((dbThoughtsData) => {
        !dbThoughtsData
          ? res.status(400).json({ message: "No Thoughts Found With That Id" })
          : res.json(dbThoughtsData);
      })
      .catch((err) => res.status(400).json(err));
  },

  deleteReaction({ params }, res) {
    Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
    )
      .then((dbThoughtsData) => {
        !dbThoughtsData
          ? res.status(400).json({ message: "No Thoughts Found With That Id" })
          : res.json(dbThoughtsData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = thoughtsController;
