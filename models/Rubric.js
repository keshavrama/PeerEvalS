const mongoose = require('mongoose');

const performanceSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: null,
  },
},
{ _id: false }
)

const criteriaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    min: 0, 
    max: 100,
  },
  performances: {
    type: [performanceSchema],
    required: true,
  },
},
{ _id: false }
)

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
}, 
{ _id: false }
)

const RubricSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  // scale: { type: Number, required: true },
  // items: { type: [RubricItemSchema], required: true },
  criteria: {
    type: [criteriaSchema],
    required: true
  },
  feedback: {
    type: [feedbackSchema],
  },
  createdAt: {
    type: Date, 
    default: Date.now(),
  },
  managedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  releaseResults:{
    type: Boolean,
    default: false,
  }
});

let Rubric = mongoose.model('Rubric', RubricSchema);
module.exports = Rubric;
