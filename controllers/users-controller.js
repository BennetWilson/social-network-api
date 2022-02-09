const { Users } = require("../models");

const usersController = {
  createUsers(req, res) {
    Users.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(404).json(err));
  },

  getAllUsers(req, res) {
    Users.find({})
      .populate({ path: "thoughts", select: "-__v" })
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(400).json(err));
  },

  getUsersById(req, res) {
    Users.findOne({ _id: req.params.userId })
      .populate({ path: "thoughts", select: "-__v" })
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUserData) => {
        !dbUserData
          ? res.status(404).json({ message: "No User With That Id" })
          : res.json(dbUserData);
      })
      .catch((err) => res.status(500).json(err));
  },

  updateUsers({ params, body }, res) {
    Users.FindOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((dbUserData) => {
        !dbUserData
          ? res.status(404).json({ message: "No User With That Id" })
          : res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  deleteUsers(req, res) {
    Users.findOneAndDelete({ _id: req.params.userId })
      .then((dbUserData) =>
        !dbUserData
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(dbUserData)
      )
      .then(() =>
        res.json({ message: "User and associated thougths deleted!" })
      )
      .catch((err) => res.status(500).json(err));
  },

  addFriend({ params, body }, res) {
    Users.FindOneAndUpdate(
      { _id: params.id },
      { $push: { friends: params.friendId } },
      { new: true }
    )
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUserData) => {
        !dbUserData
          ? res.status(404).json({ message: "No User Found With That Id" })
          : res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  deleteFriend({ params }, res) {
    Users.FindOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendId } },
      { new: true }
    )
      .populate({ path: "friends", select: "-__v" })
      .select("-__v")
      .then((dbUserData) => {
        !dbUserData
          ? res.status(400).json({ message: "No User Found With That Id" })
          : res.json(dbUserData);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = usersController;
