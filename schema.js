const Joi = require("joi");

module.exports.courseSchema = Joi.object({
    course: Joi.object({
        description: Joi.string().required(),
        courseCode: Joi.string().required(),
        courseId: Joi.string().required(),
    }).required(),
})