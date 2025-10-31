import nodemailer, { Transporter } from 'nodemailer';
import { env } from './enviroment';
import { logger } from '../utils/logger';



let transporter: Transporter | null = null;


export const initializeEmailService = async (): Promise<void> => {
  try {
    transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      secure: env.EMAIL_SECURE,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });

 
    await transporter.verify();
    logger.info('Email service initialized successfully');
  } catch (error) {
    logger.error('Email service initialization failed:', error);
    // Don't throw - let app start even if email is down
  }
};


export const getEmailTransporter = (): Transporter => {
  if (!transporter) {
    throw new Error('Email service not initialized. Call initializeEmailService() first.');
  }
  return transporter;
};


export const sendEmail = async (
  options: nodemailer.SendMailOptions
): Promise<void> => {
  try {
    const emailTransporter = getEmailTransporter();
    
    const info = await emailTransporter.sendMail({
      from: env.EMAIL_USER,
      ...options,
    });

    logger.info('Email sent successfully', {
      messageId: info.messageId,
      recipient: options.to,
    });
  } catch (error) {
    logger.error('Failed to send email', {
      recipient: options.to,
      subject: options.subject,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
 
  }
};