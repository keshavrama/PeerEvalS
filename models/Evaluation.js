const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  criteria: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
}, 
{ _id: false }
)

const feedbackSchema = new mongoose.Schema({
  strength: {
    type: String,
    default: "",
  },
  improve: {
    type: String,
    default: "",
  },
  other: {
    type: String,
    default: "",
  },
}, 
{ _id: false }
)

const evaluationSchema = new mongoose.Schema({
  evaluatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evaluateeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  rubricId: { type: mongoose.Schema.Types.ObjectId, ref: 'Rubric', required: true },
  scores: {
    type: [scoreSchema],
    required: true,
  },
  feedback: {
    type: [feedbackSchema],
  },
  total: {
    type: Number,
  },
  createdAt: {
    type: Date, 
    default: Date.now(),
  },
  updatedAt: {
    type: Date, 
    default: Date.now(),
  },
}, 
{ timestamps: true }); //auto adds createdAt and updatedAt

module.exports = mongoose.model('Evaluation', evaluationSchema);



