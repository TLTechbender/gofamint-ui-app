import express from 'express';
import nodemailer from 'nodemailer';

const app = express();
app.use(express.json());

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_SECURE === 'true' ? 465 : 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  logger: true,
  debug: true,
});

transporter.verify((err, success) => {
  if (err) console.log('SMTP connection error:', err);
  else console.log('SMTP server ready to send emails');
});

app.get('/', (_req, res) => {
  res.json({ message: 'Email service is running' });
});

app.post('/api/send-email', async (req, res) => {
  const { to, subject, html } = req.body;

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing required parameters: to, subject, html' });
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    res.status(200).json({ 
      success: true,
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Email send failed:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message 
    });
  }
});

export default app;
