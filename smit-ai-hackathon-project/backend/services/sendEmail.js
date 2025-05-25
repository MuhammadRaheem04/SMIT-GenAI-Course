const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const sendEmail = async (user, idCardPath) => {
  try {
    // Check if required environment variables are set
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const emailService = process.env.EMAIL_SERVICE || 'gmail';

    if (!emailUser || !emailPassword) {
      console.warn('⚠️ Email credentials not configured. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
      return false;
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: emailService,
      auth: {
        user: emailUser,
        pass: emailPassword
      }
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ Email transporter verified');

    // Email content
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563EB, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #64748b; font-size: 14px; }
        .button { display: inline-block; background: #2563EB; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Registration Successful!</h1>
          <p>Welcome to Saylani Mass IT Training</p>
        </div>
        
        <div class="content">
          <h2>Dear ${user.fullName},</h2>
          
          <p>Congratulations! Your registration for <strong>${formatProgram(user.program)}</strong> has been successfully completed.</p>
          
          <div class="highlight">
            <h3>📋 Registration Details:</h3>
            <ul>
              <li><strong>Registration ID:</strong> ${user.registrationId}</li>
              <li><strong>Program:</strong> ${formatProgram(user.program)}</li>
              <li><strong>Email:</strong> ${user.email}</li>
              <li><strong>Phone:</strong> ${user.phone}</li>
              <li><strong>Registration Date:</strong> ${new Date(user.createdAt).toLocaleDateString()}</li>
            </ul>
          </div>
          
          <p>📄 <strong>Your Digital ID Card is attached to this email.</strong> Please save it for future reference and present it during your training sessions.</p>
          
          <h3>🚀 What's Next?</h3>
          <ul>
            <li>✅ Keep your Digital ID Card safe</li>
            <li>📅 Wait for orientation session details</li>
            <li>📚 Prepare for your training journey</li>
            <li>📞 Contact us if you have any questions</li>
          </ul>
          
          <p>We're excited to have you join Pakistan's largest IT training program!</p>
          
          <div class="footer">
            <p><strong>Saylani Mass IT Training</strong><br>
            Building careers, transforming lives<br>
            📧 Email: support@saylani.org<br>
            📞 Phone: +92-21-111-729-526</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;

    // Prepare email options
    const mailOptions = {
      from: {
        name: 'Saylani Mass IT Training',
        address: emailUser
      },
      to: user.email,
      subject: `🎉 Registration Successful - Digital ID Card | ${user.registrationId}`,
      html: htmlContent,
      attachments: []
    };

    // Add ID card attachment if file exists
    if (idCardPath && fs.existsSync(idCardPath)) {
      mailOptions.attachments.push({
        filename: `Saylani-ID-Card-${user.registrationId}.pdf`,
        path: idCardPath,
        contentType: 'application/pdf'
      });
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);

    return true;

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    return false;
  }
};

// Helper function to format program names
const formatProgram = (program) => {
  const programMap = {
    'web-development': 'Web Development',
    'mobile-app-development': 'Mobile App Development',
    'artificial-intelligence': 'Artificial Intelligence',
    'graphic-design': 'Graphic Design',
    'digital-marketing': 'Digital Marketing',
    'data-science': 'Data Science',
    'cybersecurity': 'Cybersecurity',
    'cloud-computing': 'Cloud Computing'
  };
  return programMap[program] || program;
};

module.exports = sendEmail;