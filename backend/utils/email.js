const nodemailer = require("nodemailer");

const sendConfirmationEmail = (name, userEmail, confirmationCode, url) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL,
    to: userEmail,
    subject: "Please confirm your account",
    html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for signing up. Please confirm your email by clicking on the following link</p>
        <a href=${url}> Click here</a>
        </div>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("err");
      console.log(err.message);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendConfirmationEmail;
