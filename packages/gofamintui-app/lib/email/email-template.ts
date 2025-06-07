// lib/email-templates.ts
export interface EmailTemplateData {
  // Common fields
  churchName: string;
  churchTagline: string;
  userName: string;
  supportEmail: string;
  churchAddress: string;
  churchPhone: string;
  churchEmail: string;
  churchWebsite: string;
  unsubscribeLink?: string;
  privacyLink?: string;

  // Conditional flags
  isVerificationEmail?: boolean;
  isPasswordReset?: boolean;
  isLoginNotification?: boolean;
  isPasswordUpdate?: boolean;

  // Email-specific data
  verificationLink?: string;
  resetLink?: string;
  expirationTime?: string;
  loginDate?: string;
  loginTime?: string;
  loginLocation?: string;
  deviceInfo?: string;
  securityLink?: string;
  updateDate?: string;
  updateTime?: string;
  supportLink?: string;
}

// Helper function to replace template variables
function replaceTemplateVariables(
  template: string,
  data: EmailTemplateData
): string {
  let result = template;

  // Replace simple variables
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === "string") {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, value);
    }
  });

  // Handle conditional blocks
  result = result.replace(
    /{{#if isVerificationEmail}}([\s\S]*?){{\/if}}/g,
    data.isVerificationEmail ? "$1" : ""
  );

  result = result.replace(
    /{{#if isPasswordReset}}([\s\S]*?){{\/if}}/g,
    data.isPasswordReset ? "$1" : ""
  );

  result = result.replace(
    /{{#if isLoginNotification}}([\s\S]*?){{\/if}}/g,
    data.isLoginNotification ? "$1" : ""
  );

  result = result.replace(
    /{{#if isPasswordUpdate}}([\s\S]*?){{\/if}}/g,
    data.isPasswordUpdate ? "$1" : ""
  );

  return result;
}

export const getChurchEmailTemplate = (data: EmailTemplateData): string => {
  const template = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>{{churchName}} - Church App</title>
      <style>
          body {
              margin: 0;
              padding: 0;
              font-family: 'Georgia', 'Times New Roman', serif;
              background-color: #f8f9fa;
              color: #333;
          }
          
          .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          
          .header {
              background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
              color: white;
              padding: 30px 20px;
              text-align: center;
          }
          
          .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 300;
              letter-spacing: 1px;
          }
          
          .header .tagline {
              margin: 8px 0 0 0;
              font-size: 14px;
              opacity: 0.9;
              font-style: italic;
          }
          
          .content {
              padding: 40px 30px;
              line-height: 1.6;
          }
          
          .greeting {
              font-size: 18px;
              margin-bottom: 20px;
              color: #2d3748;
          }
          
          .message {
              font-size: 16px;
              margin-bottom: 30px;
              color: #4a5568;
          }
          
          .emphasis {
              background-color: #fef5e7;
              border-left: 4px solid #d69e2e;
              padding: 15px 20px;
              margin: 25px 0;
              border-radius: 0 4px 4px 0;
          }
          
          .emphasis.security {
              background-color: #fed7d7;
              border-left-color: #e53e3e;
          }
          
          .emphasis.verification {
              background-color: #e6fffa;
              border-left-color: #319795;
          }
          
          .cta-button {
              display: inline-block;
              background: linear-gradient(135deg, #3182ce 0%, #2c5282 100%);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 6px;
              font-weight: 600;
              margin: 20px 0;
              transition: transform 0.2s ease;
          }
          
          .cta-button:hover {
              transform: translateY(-2px);
          }
          
          .info-box {
              background-color: #f7fafc;
              border: 1px solid #e2e8f0;
              padding: 20px;
              border-radius: 6px;
              margin: 25px 0;
          }
          
          .info-box h3 {
              margin-top: 0;
              color: #2d3748;
              font-size: 16px;
          }
          
          .info-box ul {
              margin: 10px 0;
              padding-left: 20px;
          }
          
          .footer {
              background-color: #2d3748;
              color: #a0aec0;
              padding: 30px;
              text-align: center;
              font-size: 14px;
          }
          
          .footer a {
              color: #63b3ed;
              text-decoration: none;
          }
          
          .divider {
              height: 1px;
              background-color: #e2e8f0;
              margin: 30px 0;
          }
          
          @media (max-width: 600px) {
              .content {
                  padding: 30px 20px;
              }
              
              .header h1 {
                  font-size: 24px;
              }
              
              .cta-button {
                  display: block;
                  text-align: center;
                  margin: 20px 0;
              }
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="header">
              <h1>{{churchName}}</h1>
              <p class="tagline">{{churchTagline}}</p>
          </div>
          
          <div class="content">
              <div class="greeting">
                  Hello {{userName}},
              </div>
              
              {{#if isVerificationEmail}}
              <div class="message">
                  Welcome to the {{churchName}} community! We're excited to have you join our digital fellowship.
              </div>
              
              <div class="emphasis verification">
                  <strong>Important:</strong> Please verify your email address to complete your registration and access all features of our church app.
              </div>
              
              <div class="message">
                  Click the button below to verify your email address:
              </div>
              
              <center>
                  <a href="{{verificationLink}}" class="cta-button">Verify My Email Address</a>
              </center>
              
              <div class="info-box">
                  <h3>What happens after verification?</h3>
                  <ul>
                      <li>Access to sermon recordings and notes</li>
                      <li>Event notifications and church updates</li>
                      <li>Prayer request submissions</li>
                      <li>Community connection features</li>
                  </ul>
              </div>
              {{/if}}
              
              {{#if isPasswordReset}}
              <div class="message">
                  We received a request to reset your password for your {{churchName}} app account.
              </div>
              
              <div class="emphasis security">
                  <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.
              </div>
              
              <div class="message">
                  Click the button below to create a new password:
              </div>
              
              <center>
                  <a href="{{resetLink}}" class="cta-button">Reset My Password</a>
              </center>
              
              <div class="info-box">
                  <h3>Password Reset Instructions:</h3>
                  <ul>
                      <li>This link will expire in {{expirationTime}} for security</li>
                      <li>Choose a strong password with at least 8 characters</li>
                      <li>Include uppercase, lowercase, numbers, and symbols</li>
                      <li>Don't reuse passwords from other accounts</li>
                  </ul>
              </div>
              {{/if}}
              
              {{#if isLoginNotification}}
              <div class="message">
                  We're writing to inform you about recent activity on your {{churchName}} app account.
              </div>
              
              <div class="emphasis">
                  <strong>Account Activity:</strong> Someone signed into your account on {{loginDate}} at {{loginTime}} from {{loginLocation}}.
              </div>
              
              <div class="info-box">
                  <h3>Login Details:</h3>
                  <ul>
                      <li><strong>Date:</strong> {{loginDate}}</li>
                      <li><strong>Time:</strong> {{loginTime}}</li>
                      <li><strong>Location:</strong> {{loginLocation}}</li>
                      <li><strong>Device:</strong> {{deviceInfo}}</li>
                  </ul>
              </div>
              
              <div class="message">
                  If this was you, no action is needed. If you don't recognize this activity, please secure your account immediately.
              </div>
              
              <center>
                  <a href="{{securityLink}}" class="cta-button">Review Account Security</a>
              </center>
              {{/if}}
              
              {{#if isPasswordUpdate}}
              <div class="message">
                  Your password for the {{churchName}} app has been successfully updated.
              </div>
              
              <div class="emphasis verification">
                  <strong>Confirmation:</strong> Your account password was changed on {{updateDate}} at {{updateTime}}.
              </div>
              
              <div class="message">
                  If you made this change, no further action is required. Your account is secure.
              </div>
              
              <div class="info-box">
                  <h3>Security Reminder:</h3>
                  <ul>
                      <li>Never share your password with anyone</li>
                      <li>Use a unique password for your church app account</li>
                      <li>Consider using a password manager</li>
                      <li>Contact us if you notice any suspicious activity</li>
                  </ul>
              </div>
              
              <div class="message">
                  If you did NOT make this change, please contact our support team immediately.
              </div>
              
              <center>
                  <a href="{{supportLink}}" class="cta-button">Contact Support</a>
              </center>
              {{/if}}
              
              <div class="divider"></div>
              
              <div class="message">
                  <strong>Need Help?</strong><br>
                  If you have any questions or need assistance, our church tech team is here to help. Reply to this email or contact us at {{supportEmail}}.
              </div>
              
              <div class="message">
                  Blessings,<br>
                  <strong>{{churchName}} Digital Ministry Team</strong>
              </div>
          </div>
          
          <div class="footer">
              <p>{{churchName}}<br>
              {{churchAddress}}<br>
              {{churchPhone}} | {{churchEmail}}</p>
              
              <p>
                  <a href="{{unsubscribeLink}}">Unsubscribe</a> | 
                  <a href="{{privacyLink}}">Privacy Policy</a> | 
                  <a href="{{churchWebsite}}">Visit Our Website</a>
              </p>
              
              <p style="margin-top: 20px; font-style: italic;">
                  "Let us consider how we may spur one another on toward love and good deeds." - Hebrews 10:24
              </p>
          </div>
      </div>
  </body>
  </html>`;

  return replaceTemplateVariables(template, data);
};
