const nodemailer = require("nodemailer");

 
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'sukitex.suport@gmail.com', // generated ethereal user
      pass: 'pgmjxzyjvrxelncs', // generated ethereal password
    },
  });

transporter.verify(
    //console.log('tamo ready papi')
)

module.exports = transporter;