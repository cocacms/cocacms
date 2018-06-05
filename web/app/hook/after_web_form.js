'use strict';
const nodemailer = require('nodemailer');

const sendMail = (host, user, pass, to, subject, text) => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      host,
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user, // generated ethereal user
        pass, // generated ethereal password
      },
    });

    const mailOptions = {
      from: `"Notice" <${user}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return reject(error);
      }
      resolve(info);
    });
  });
};
module.exports = () => {
  return async function auth(ctx) {
    if (ctx.status === 200) {
      const config = await ctx.service.config.get();
      const { mail = {} } = config;
      await sendMail(
        mail.smtp,
        mail.account,
        mail.password,
        mail.to,
        mail.title,
        `${mail.content}`
      );
    }
  };
};
