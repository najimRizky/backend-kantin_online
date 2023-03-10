import nodemailer from "nodemailer"
import mailTransporter from "../config/mailTransporter.js"

const BASE_URL = process.env.BASE_URL

const sendEmailConfirmation = ({ email, fullName, confirmationToken }) => {
    const transporter = nodemailer.createTransport(mailTransporter)
    const confirmationLink = `${BASE_URL}/api/register/confirm?token=${confirmationToken}`
    const mailOptions = {
        to: email,
        subject: "Kantin UMN Email Confirmation",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f1f1f1; padding: 20px;">
            <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px;">
                <tr>
                    <td>
                        <h1 style="text-align: center; margin-top: 0;">Kantin UMN Email Confirmation</h1>
                        <p>Dear ${fullName},</p>
                        <p>Thank you for signing up with our service. To complete your registration, please click the button below to confirm your email address.</p>
                        <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top: 20px;">
                            <tr>
                                <td style="border-radius: 3px; background-color: #007bff; text-align: center;">
                                    <a href="${confirmationLink}" style="display: block; padding: 10px 20px; color: #fff; text-decoration: none;">Confirm Email Address</a>
                                </td>
                            </tr>
                        </table>
                        <p>If you did not register for our service, please disregard this message.</p>
                        <p>Thank you,<br>The Kantin UMN Developer Team</p>
                    </td>
                </tr>
            </table>
        </div>
        `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error.message);
            // res.status(500).json({ message: "Failed to send email" })
        } else {
            console.log('Email sent: ' + info.response);
            // res.status(200).json({ message: "Ok" })
        }
    });
}

export default sendEmailConfirmation