const { Thoughts, Users} = require('../models');

const thoughtsController = {

createThoughts({params, body}, res) {
  Thoughts.create(body)
  .then(({_id}) => {
    return Users.findOneAndUpdate({_id: params.userId}, {$push: {thoughts: _id}}, {new: true});
  })
  .then(dbThoughtsData => {
    if(!dbThoughtsData) {
      res.status(400).json({message: 'No thoughts with that ID'});
      return;
    }
    res.json(dbThoughtsData)
  })
  .catch(err => {
    res.json(err);
  });
},

getAllThoughts(req,res) {
  Thoughts.find({})
  .populate({path: 'reactions', select: '-__v'})
  .select('-__v')
  .then(dbThoughtsData => {
    res.json(dbThoughtsData)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err)
  });
},

getThoughtsById({params}, res) {
  Thoughts.findOne({_id: params.id})
  .populate({path: 'reactions', select: '-__v'})
  .select('-__v')
  .then(dbThoughtsData => {
    if(!dbThoughtsData) {
      res.status(404).json({message: 'No Thought found with this id'});
      return;
    }
    res.json(dbThoughtsData);
  })
  .catch(err => {
    console.log(err);
    res.sendStatus(400);
  });
},

updateThoughts({params, body}, res) {
  Thoughts.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
  .populate({path: 'reactions', select: '-__v'})
  .select('-__v')
  .then(dbThoughtsData => {
    if(!dbThoughtsData) {
      res.status(404).json({message: 'No Thought Found With This ID'});
      return;
    }
    res.json(dbThoughtsData);
  })
  .catch(err => {
    res.json(err);
  });
},

deleteThoughts({params}, res) {
  Thoughts.findOneAndDelete({_id: params.id})
  .then(dbThoughtsData => {
    if(!dbThoughtsData) {
      res.status(400).json({message: 'No Thought Found With That ID'});
      return;
    }
    res.json(dbThoughtsData);
  })
  .catch( err => {
    res.status(400).json(err);
  })
},



}