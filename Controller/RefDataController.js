const { StatusCodes } = require('http-status-codes');
const RefData = require('../Model/RefData');

module.exports = {
  getRefData: async (request, response) => {
    const fetchRefDataType = request.query.refDataType;
    console.log('fetchRefDataType', fetchRefDataType);
    let refDataDetail = await RefData.find(
      fetchRefDataType
        ? {
            refDataType: fetchRefDataType,
          }
        : null
    ).catch((error) => next(error));
    response.status(StatusCodes.OK).send({
      data: refDataDetail,
    });
  },

  addRefDataValue: async (request, response) => {
    let refDataType = request.params.refDataType;
    let newRefDataValue = request.body.refDataValue;
    console.log('Ref Data', refDataType);
    console.log('Ref Type', newRefDataValue);
    let updatedRefData = await RefData.findOneAndUpdate(
      { refDataType: refDataType },
      {
        $addToSet: { refDataValue: newRefDataValue },
      },
      {
        new: true,
      }
    ).catch((error) => next(error));
    response.status(StatusCodes.OK).send({
      data: updatedRefData,
    });
  },

  addRefDataType: async (request, response) => {
    let refDataType = request.body.refDataType;
    let refData = new RefData();
    refData.refDataType = refDataType;
    let savedRefData = await refData.save().catch((error) => next(error));
    response.status(StatusCodes.OK).send({
      data: savedRefData,
    });
  },
};
