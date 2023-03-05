const user = process.env.MAIL_EMAIL
const pass = process.env.MAIL_PASSWORD

const mailTransporter = {
    service: "gmail",
    auth: {
        user,
        pass
    },
    tls: {
        rejectUnauthorized: false
    }
}

module.exports = mailTransporter