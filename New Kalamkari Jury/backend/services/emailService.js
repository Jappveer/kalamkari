const nodemailer = require('nodemailer');

class EmailService {
  static async sendEmail(options) {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message
    };

    await transporter.sendMail(mailOptions);
  }

  static async sendVerificationEmail(user) {
    const verificationToken = this.generateVerificationToken(user);
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

    const message = `
      Welcome to Kalamkari E-Commerce!
      
      Please verify your email by clicking the link below:
      ${verificationUrl}

      If you did not create an account, please ignore this email.
    `;

    await this.sendEmail({
      email: user.email,
      subject: 'Kalamkari Email Verification',
      message
    });
  }

  static async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      You have requested a password reset for your Kalamkari account.
      
      Click the link below to reset your password:
      ${resetUrl}

      If you did not request a password reset, please ignore this email.
    `;

    await this.sendEmail({
      email: user.email,
      subject: 'Kalamkari Password Reset',
      message
    });
  }
}

module.exports = EmailService;