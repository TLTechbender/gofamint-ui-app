// lib/email.ts
import nodemailer from "nodemailer";
import { getChurchEmailTemplate, EmailTemplateData } from "./email-template";

// Create transporter
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_HOST,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Base church data - customize this for your church
const getBaseChurchData = (): Partial<EmailTemplateData> => ({
  churchName: process.env.CHURCH_NAME || "Grace Community Church",
  churchTagline: process.env.CHURCH_TAGLINE || "Growing in Faith Together",
  supportEmail: process.env.SUPPORT_EMAIL || "support@gracechurch.com",
  churchAddress:
    process.env.CHURCH_ADDRESS || "123 Faith Street, Springfield, IL 62701",
  churchPhone: process.env.CHURCH_PHONE || "(555) 123-4567",
  churchEmail: process.env.CHURCH_EMAIL || "info@gracechurch.com",
  churchWebsite: process.env.CHURCH_WEBSITE || `${process.env.NEXTAUTH_URL}`,
  unsubscribeLink: `${process.env.NEXTAUTH_URL}/unsubscribe`,
  privacyLink: `${process.env.NEXTAUTH_URL}/privacy`,
  supportLink: `${process.env.NEXTAUTH_URL}/support`,
  securityLink: `${process.env.NEXTAUTH_URL}/security`,
});

export async function sendVerificationEmail(
  email: string,
  token: string,
  firstName: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/${token}`;

  const templateData: EmailTemplateData = {
    ...getBaseChurchData(),
    userName: firstName,
    isVerificationEmail: true,
    verificationLink: verificationUrl,
  } as EmailTemplateData;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `${templateData.churchName} - Verify Your Email Address`,
    html: getChurchEmailTemplate(templateData),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  firstName: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/forgot-password/reset/${token}`;

  const templateData: EmailTemplateData = {
    ...getBaseChurchData(),
    userName: firstName,
    isPasswordReset: true,
    resetLink: resetUrl,
    expirationTime: "1 hour",
  } as EmailTemplateData;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `${templateData.churchName} - Reset Your Password`,
    html: getChurchEmailTemplate(templateData),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent successfully");
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}

export async function sendLoginNotificationEmail(
  email: string,
  firstName: string,
  loginDetails: {
    date: string;
    time: string;
    location: string;
    device: string;
  }
) {
  const templateData: EmailTemplateData = {
    ...getBaseChurchData(),
    userName: firstName,
    isLoginNotification: true,
    loginDate: loginDetails.date,
    loginTime: loginDetails.time,
    loginLocation: loginDetails.location,
    deviceInfo: loginDetails.device,
  } as EmailTemplateData;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `${templateData.churchName} - Account Login Notification`,
    html: getChurchEmailTemplate(templateData),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Login notification email sent successfully");
  } catch (error) {
    console.error("Error sending login notification email:", error);
    // Don't throw error for notification emails as they're not critical
  }
}

export async function sendPasswordUpdateEmail(
  email: string,
  firstName: string,
  updateDetails: {
    date: string;
    time: string;
  }
) {
  const templateData: EmailTemplateData = {
    ...getBaseChurchData(),
    userName: firstName,
    isPasswordUpdate: true,
    updateDate: updateDetails.date,
    updateTime: updateDetails.time,
  } as EmailTemplateData;

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: email,
    subject: `${templateData.churchName} - Password Updated Successfully`,
    html: getChurchEmailTemplate(templateData),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Password update email sent successfully");
  } catch (error) {
    console.error("Error sending password update email:", error);
    // Don't throw error for confirmation emails as they're not critical
  }
}

// Usage Examples:

// 1. Send verification email
// await sendVerificationEmail('user@example.com', 'token123', 'John');

// 2. Send password reset
// await sendPasswordResetEmail('user@example.com', 'resettoken456', 'John');

// 3. Send login notification
// await sendLoginNotificationEmail('user@example.com', 'John', {
//   date: 'December 15, 2024',
//   time: '2:30 PM EST',
//   location: 'Chicago, IL',
//   device: 'iPhone 15 Pro - Safari'
// });

// 4. Send password update confirmation
// await sendPasswordUpdateEmail('user@example.com', 'John', {
//   date: 'December 15, 2024',
//   time: '3:45 PM EST'
// });
