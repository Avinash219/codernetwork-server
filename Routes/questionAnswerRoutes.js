const express = require('express');
const {
  submitAnswer,
  getQuestionsAnswer,
} = require('../Controller/answerController');
const {
  addQuestion,
  getQuestionList,
} = require('../Controller/questionController');
const loginMiddleware = require('../Middleware/loginMiddleware');

const questionAnswerRouter = express.Router();
questionAnswerRouter.post('/addQuestion', loginMiddleware, addQuestion);
questionAnswerRouter.get('/getQuestion', getQuestionList);
questionAnswerRouter.post('/submitAnswer', loginMiddleware, submitAnswer);
questionAnswerRouter.get(
  '/questionsAnswer/:questionId',
  loginMiddleware,
  getQuestionsAnswer
);

module.exports = questionAnswerRouter;
