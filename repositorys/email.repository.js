const nodeMailer = require('nodemailer');

exports.sendEmail = async (config, message) => {
    const transporter = nodeMailer.createTransport(config);

    return transporter.sendMail(message)
            .then((info) => {
                msg: 'Email sended Successfully'
            })
            .catch((error) => {
                throw new Error('Email sending Failed: ' + error.message);
            })
}