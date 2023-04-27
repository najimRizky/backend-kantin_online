import nodemailer from "nodemailer"
import mailTransporter from "../config/mailTransporter.js"

const BASE_URL_BE = process.env.BASE_URL_BE
const BASE_URL_FE = process.env.BASE_URL_FE

const transporter = nodemailer.createTransport(mailTransporter)

const sendEmailConfirmation = ({ email, fullName, confirmationToken }) => {
    try {
        const confirmationLink = `${BASE_URL_BE}/account/confirm?token=${confirmationToken}`
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
                console.log('Cuatomer email confirmation sent: ' + info.response);
                // res.status(200).json({ message: "Ok" })
            }
        });
    } catch (err) {
        console.log(err)
    }
}

const sendResetPasswordLink = ({ email, fullName, resetPasswordToken }) => {
    try {
        const resetPasswordLink = `${BASE_URL_FE}/account/reset-password?token=${resetPasswordToken}`
        const mailOptions = {
            to: email,
            subject: "Kantin UMN Reset Password",
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f1f1f1; padding: 20px;">
                <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px;">
                    <tr>
                        <td>
                            <h1 style="text-align: center; margin-top: 0;">Kantin UMN Reset Password</h1>
                            <p>Dear ${fullName},</p>
                            <p>We received a request to reset your password for your Kantin UMN account. To proceed with the password reset process, please click the link below.</p>
                            <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-top: 20px;">
                                <tr>
                                    <td style="border-radius: 3px; background-color: #007bff; text-align: center;">
                                        <a href="${resetPasswordLink}" style="display: block; padding: 10px 20px; color: #fff; text-decoration: none;">Reset Your Password</a>
                                    </td>
                                </tr>
                            </table>
                            <p>If you did not request a password reset, please ignore this email.</p>
                            <p>Please note that for security reasons, the password reset link will expire in <b>30 minutes</b> from the time it was sent. If you do not reset your password within this time frame, you will need to request a new password reset.</p>
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
                console.log('Reset password email sent: ' + info.response);
                // res.status(200).json({ message: "Ok" })
            }
        });
    } catch (err) {
        console.log(err)
    }
}

const sendRegisterTenantEmail = ({ email, fullName, password }) => {
    try {
        const mailOptions = {
            to: email,
            subject: "Kantin UMN Register Tenant",
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f1f1f1; padding: 20px;">
                <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px;">
                    <tr>
                        <td>
                            <h1 style="text-align: center; margin-top: 0;">Kantin UMN Register Tenant</h1>
                            <p>Dear Tenant "${fullName}", thank you for joining Kantin UMN</p>
                            <p>Here is your account information:</p>
                            <div style="margin-top: 20px;">
                                <p>Email: ${email}</p>
                                <p>Password: ${password}</p>
                            </div>                    
                        </td>
                    </tr>
                </table>
            </div>
            `
        }

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Tenant account comfirmation email sent: ' + info.response);
            }
        });
    } catch (err) {
        console.log(err)
    }
}



export default {
    sendEmailConfirmation,
    sendResetPasswordLink,
    sendRegisterTenantEmail
}