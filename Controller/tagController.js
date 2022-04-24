const { StatusCodes } = require('http-status-codes');
const Tag = require('../Model/Tag');

module.exports = {
  getAllTags: async (request, response) => {
    let tagList = await Tag.find({});
    return response.status(StatusCodes.OK).send({
      data: tagList,
    });
  },
  addTag: async (request, response, next) => {
    let { name } = request.body;
    let newTag = new Tag({ name });
    let newTagSave = await newTag.save().catch((error) => next(error));
    return response.status(StatusCodes.OK).send({
      data: newTagSave,
    });
  },
};
