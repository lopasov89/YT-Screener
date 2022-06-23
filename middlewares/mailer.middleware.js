const nodemailer = require('nodemailer')
require('dotenv').config()

const mail = process.env.MAIL
const mailPass = process.env.MAIL_PASS

const transporter = nodemailer.createTransport(
  {
    host: 'smtp.mail.ru',
    port: 465,
    secure: true,
    auth: {
      user: `${mail}`,
      pass: `${mailPass}`,
    },
  },
  {
    from: `YT Screener <${mail}>`,
  },
)

const mailer = (message) => {
  transporter.sendMail(message, (err, info) => {
    if (err) return console.log(err)
    console.log(`Email sent: ${info}`)
  })
}

module.exports = mailer
