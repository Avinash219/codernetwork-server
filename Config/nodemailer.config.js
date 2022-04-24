const nodemailer = require('nodemailer');

const {
  CONFIRMATION_CONSTANT,
  GENERATE_PASSWORD_CONSTANT,
} = require('./config-constant');

const username = process.env.USERNAME;
const password = process.env.PASSWORD;

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: username,
    pass: password,
  },
});

module.exports = {
  sendConfirmationMail: (name, email, confirmationCode) => {
    transport
      .sendMail({
        from: username,
        to: email,
        subject: CONFIRMATION_CONSTANT.SUBJECT,
        html: `<h1>${CONFIRMATION_CONSTANT.EMAIL}</h1>
        <h2>${CONFIRMATION_CONSTANT.HELLO_STRING} ${name}</h2>
        <p>${CONFIRMATION_CONSTANT.BODY}</p>
        <a href=${process.env.CONFIRM_ACCOUNT_URL}${confirmationCode}> ${CONFIRMATION_CONSTANT.CLICK_CONSTANT}</a>
        </div>`,
      })
      .catch((err) => console.log(err));
  },
  generatePasswordLink: (name, email, token) => {
    transport
      .sendMail({
        from: username,
        to: email,
        subject: `${GENERATE_PASSWORD_CONSTANT.SUBJECT}`,
        html: `<h1>${GENERATE_PASSWORD_CONSTANT.EMAIL}</h1>
        <h2>${GENERATE_PASSWORD_CONSTANT.HELLO_STRING} ${name}</h2>
        <p>${GENERATE_PASSWORD_CONSTANT.BODY}</p>
        <a href=${process.env.RESET_PASSWORD_URL}${token}> Click here</a>
        </div>`,
      })
      .catch((err) => console.log(err));
  },
};
