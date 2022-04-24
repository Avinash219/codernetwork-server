const { StatusCodes } = require('http-status-codes');
const Question = require('../Model/Question');
const Tag = require('../Model/Tag');

module.exports = {
  getQuestionList: async (request, response, next) => {
    let tagList = request.body.tagList;

    let questionList = await Question.find(
      tagList
        ? {
            questionTags: {
              $in: tagList,
            },
          }
        : {}
    ).catch((error) => next(error));

    return response.status(StatusCodes.OK).send({
      data: questionList,
    });
  },

  addQuestion: async (request, response, next) => {
    let askedBy = request.user._id;
    let question = request.body.question;
    let questionTags = request.body.tagList;

    let saveQuestion = new Question({
      question,
      askedBy,
      questionTags,
    });

    let saveQuestionPersistence = await saveQuestion
      .save()
      .catch((error) => next(error));

    await Tag.updateMany(
      { _id: saveQuestionPersistence.questionTags },
      { $push: { questionTagged: saveQuestionPersistence._id } }
    );

    return response.status(StatusCodes.OK).send({
      data: saveQuestionPersistence,
    });
  },
};
