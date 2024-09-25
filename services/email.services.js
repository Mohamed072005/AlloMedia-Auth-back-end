const Mailgen = require('mailgen');
const { sendEmail } = require('../repositorys/email.repository');

exports.sendMail = async (mailData, token) => {
    const config = {
        service: 'gmail',
        auth: {
            user: process.env.NODEJS_GMAIL_APP_USER,
            pass: process.env.NODEJS_GMAIL_APP_PASSWORD
        }
    }

    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name:'AlloMedia',
            link: 'https://github.com/Mohamed072005/AlloMedia'
        }
    })

    const mailBody = {
        body: {
            name: mailData.user_name,
            intro: 'Welcome to AlloMedia Company! We\'re very excited to have you on board.',
            action: {
                instructions: 'To get started with AlloMedia, please click here:',
                button: {
                    color: '#22BC66',
                    text: 'Confirme your account!',
                    link: `http://localhost:3000/verify/account?token=${token}`
                }
            }
        }
    }

    const emailContent = mailGenerator.generate(mailBody);
    const message = {
        from: process.env.NODEJS_GMAIL_APP_USER,
        to: mailData.email,
        subject: 'Confirme your account',
        html: emailContent,
    }

    return await sendEmail(config, message);
}