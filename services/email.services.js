const Mailgen = require('mailgen');
const { sendEmail } = require('../repositorys/email.repository');
const { body } = require('express-validator');

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
            link: 'https://github.com/Mohamed072005/AlloMedia',
            copyright: '© 2024 AlloMedia. All rights reserved.',
            // logo: 'http://localhost:3000/img/AlloMedia_transparent-.png'
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
            },
            outro: 'If you did not request a password reset, please disregard this email. If you have any concerns, feel free to reach out to our support team.',
            signature: 'Best regards, The AlloMedia Team'
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

exports.sendMailForResetPassword = async (mailData, token) => {
    const config = {
        service: 'gmail',
        auth: {
            user: process.env.NODEJS_GMAIL_APP_USER,
            pass: process.env.NODEJS_GMAIL_APP_PASSWORD
        }
    }

    const mailGenerator = new Mailgen ({
        theme: 'default',
        product: {
            name: 'AlloMedia',
            link: 'https://github.com/Mohamed072005/AlloMedia',
            copyright: '© 2024 AlloMedia. All rights reserved.',
            // logo: 'http://localhost:3000/img/AlloMedia_transparent-.png'
        }
    })

    const mailBody = {
        body: {
            name: mailData.user_name,
            intro: 'It looks like you requested a password reset for your AlloMedia account. No worries, we’ve got you covered!',
            action: {
                instructions: 'To reset your password and regain access to your account, click the button below:',
                button: {
                    color: '#FF5F57', 
                    text: 'Reset Password',
                    link: `http://localhost:3000/to/reset/password?token=${token}`,
                    
                }
            },
            outro: 'If you did not request a password reset, please disregard this email. If you have any concerns, feel free to reach out to our support team.',
            signature: 'Best regards, The AlloMedia Team'
        }
    };

    const emailContent = mailGenerator.generate(mailBody);
    const message = {
        from: process.env.NODEJS_GMAIL_APP_USER,
        to: mailData.email,
        subject: 'Reset password email',
        html: emailContent,
    }

    return await sendEmail(config, message);
}

exports.sendOTPEmail = async (userData, code, agent) => {
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
            name: 'AlloMedia',
            link: 'https://github.com/Mohamed072005/AlloMedia',
            copyright: '© 2024 AlloMedia. All rights reserved.',
            // logo: 'http://localhost:3000/img/AlloMedia_transparent-.png'
        }
    })

    const mailBody = {
        body: {
            name: userData.user_name,
            intro: 'We detected a login attempt to your account from a new device or browser.',
            table: {
                data: [
                    {
                        "Used Agent": agent, // Information about the user's new agent
                    }
                ]
            },
            outro: `Your OTP code is: <strong>${code}</strong>. This code will expire in <strong>5 minutes</strong>. If you did not request this, please disregard this email. If you have any concerns, feel free to reach out to our support team.`,
            signature: 'Best regards, The AlloMedia Team'
        }
    }

    const emailContent = mailGenerator.generate(mailBody);
    const message = {
        from: process.env.NODEJS_GMAIL_APP_USER,
        to: userData.email,
        subject: 'Code for security',
        html: emailContent,
    }

    return await sendEmail(config, message);
}