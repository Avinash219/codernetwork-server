const nodemailer = require('nodemailer');

const username = 'watchlist.dev@gmail.com';
const password = 'medium@13';

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
        subject: 'Pleas confirm your account',
        html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:4200/#/confirm/${confirmationCode}> Click here</a>
        </div>`,
      })
      .catch((err) => console.log(err));
  },
  generatePasswordLink: (name, email, token) => {
    transport
      .sendMail({
        from: username,
        to: email,
        subject: 'Password Reset',
        html: `<h1>Password Reset</h1>
        <h2>Hello ${name}</h2>
        <p>You have received the mail because you have request for Password reset</p>
        <a href=http://localhost:4200/#/reset-password/${token}> Click here</a>
        </div>`,
      })
      .catch((err) => console.log(err));
  },
};
