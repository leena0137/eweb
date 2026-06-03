const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    // If SMTP credentials aren't set, just log to console
    if (!process.env.EMAIL_USER || !process.env.EMAIL_APP_PASSWORD) {
      console.log('==================================================');
      console.log(`[EMAIL DEV LOG] TO: ${to}`);
      console.log(`[EMAIL DEV LOG] SUBJECT: ${subject}`);
      console.log('--------------------------------------------------');
      console.log(`[EMAIL DEV LOG] HTML CONTENT:`);
      console.log(html);
      console.log('==================================================');
      return { success: true, message: 'Email logged to console in dev mode' };
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Indiacart24" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, info };
  } catch (error) {
    console.error('Email send failed:', error);
    // Don't crash the server if email fails, just return a status
    return { success: false, error };
  }
};

module.exports = sendEmail;
