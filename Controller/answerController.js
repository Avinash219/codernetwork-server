const { StatusCodes } = require('http-status-codes');
const Answer = require('../Model/Answer');
const Question = require('../Model/Question');

module.exports = {
  submitAnswer: async (request, response, next) => {
    let answer = request.body.answer;
    let answeredBy = request.user._id;
    let answerOf = request.body.answerOf;

    let submitAnswer = new Answer({
      answer,
      answeredBy,
    });
    let submitAnswerPersistence = await submitAnswer
      .save()
      .catch((error) => next(error));

    await Question.findByIdAndUpdate(answerOf, {
      $push: { answer: submitAnswerPersistence._id },
    });
    return response.status(StatusCodes.OK).send({
      data: submitAnswerPersistence,
    });
  },
  getQuestionsAnswer: async (request, response, next) => {
    let questionId = request.params.questionId;
    let answerDetail = await Question.findById(questionId)
      .populate('answer')
      .select('answer')
      .catch((error) => next(error));
    return response.status(StatusCodes.OK).send({
      data: answerDetail,
    });
  },
};
