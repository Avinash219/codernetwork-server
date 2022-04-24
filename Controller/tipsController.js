const { StatusCodes } = require('http-status-codes');
const Question = require('../Model/Question');
const Tag = require('../Model/Tag');
const Tip = require('../Model/Tip');

module.exports = {
  getTipList: async (request, response, next) => {
    let tagList = request.body.tagList;

    let tipList = await Tip.find(
      tagList
        ? {
            tipTags: {
              $in: tagList,
            },
          }
        : {}
    ).catch((error) => next(error));

    return response.status(StatusCodes.OK).send({
      data: tipList,
    });
  },
  addTip: async (request, response, next) => {
    let tipDetail = request.body;

    let postedBy = request.user._id;
    let tip = request.body.tip;
    let tipTags = request.body.tagList;

    let saveTip = new Tip({
      tip,
      tipTags,
      postedBy,
    });

    console.log(saveTip);
    let saveTipPersistence = await saveTip.save().catch((error) => next(error));

    await Tag.updateMany(
      { _id: saveTipPersistence.tipTags },
      { $push: { tipTagged: saveTipPersistence._id } }
    );

    return response.status(StatusCodes.OK).send({
      data: saveTipPersistence,
    });
  },
};
