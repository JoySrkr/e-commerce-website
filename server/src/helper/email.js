const nodemailer = require("nodemailer");
const { smtpUsername, smtpPassword } = require("../secrect");

// console.log('hello:.....')
// console.log(smtpUsername)
// console.log(smtpPassword)

const transporter= nodemailer.createTransport ({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth: {
        user:smtpUsername,
        pass: smtpPassword,
    },
});

const emailWithNodeMailer = async (emailData) => {
   try {
    const mailOptions = {
        from: smtpUsername, // sender address
        to: emailData.email, //list of receivers
        subject:emailData.subject, //Subject line
        html: emailData.html, //html body

    };
    const info=await transporter.sendMail(mailOptions);
    console.log('Message sent: %s',info.response)
    
   } catch (error) {
    console.error('Error occured while sending email: ',error)
    throw error;
   };
   
}

module.exports = emailWithNodeMailer;