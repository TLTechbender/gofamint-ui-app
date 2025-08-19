import nodemailer from "nodemailer";
import verifyNewUserEmail from "./verifyNewUserEmail";
import resetPaswordEmail from "./resetPasswordEmail";

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.NEXT_SMTP_EMAIL_SERVICE,

  auth: {
    user: process.env.NEXT_SMTP_EMAIL_ADDRESS,
    pass: process.env.NEXT_SMTP_EMAIL_APP_PASSWORD,
  },
});

export async function sendVerifiyUserEmail(
  email: string,
  token: string,
  firstName: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify-email/${token}?email=${email}`;

  const mailOptions = {
    from: `${process.env.NEXT_SMTP_EMAIL_ADDRESS}`,
    to: email,
    subject: "Verify your email address",

    html: verifyNewUserEmail(firstName, verificationUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendResetPasswordEmail(
  email: string,
  token: string,
  firstName: string
) {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/forgot-password/reset/${token}?email=${email}`;

  const mailOptions = {
    from: `${process.env.NEXT_SMTP_EMAIL_ADDRESS}`,
    to: email,
    subject: "Request to change Password",

    html: resetPaswordEmail(firstName, resetUrl),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Reset email sent successfully");
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Failed to send reset email");
  }
}
