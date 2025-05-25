const User = require('../models/User');
const generateIDCard = require('../services/generateIDCard');
const sendWhatsApp = require('../services/sendWhatsApp');
const sendEmail = require('../services/sendEmail');

const registerUser = async (req, res) => {
  try {
    console.log('📝 Registration request received:', req.body);

    // Extract and validate form data
    const { fullName, cnic, email, phone, address, program } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { cnic }] 
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email or CNIC already exists'
      });
    }

    // Create new user
    const newUser = new User({
      fullName,
      cnic,
      email,
      phone,
      address,
      program
    });

    // Save user to database
    const savedUser = await newUser.save();
    console.log('✅ User saved to database:', savedUser.registrationId);

    // Generate Digital ID Card
    let idCardPath = null;
    try {
      idCardPath = await generateIDCard(savedUser);
      savedUser.idCardGenerated = true;
      console.log('✅ ID Card generated:', idCardPath);
    } catch (error) {
      console.error('❌ ID Card generation failed:', error.message);
    }

    // Send WhatsApp message
    let whatsappSuccess = false;
    try {
      if (idCardPath) {
        whatsappSuccess = await sendWhatsApp(savedUser, idCardPath);
        if (whatsappSuccess) {
          savedUser.whatsappSent = true;
          console.log('✅ WhatsApp message sent');
        }
      }
    } catch (error) {
      console.error('❌ WhatsApp sending failed:', error.message);
    }

    // Send Email
    let emailSuccess = false;
    try {
      if (idCardPath) {
        emailSuccess = await sendEmail(savedUser, idCardPath);
        if (emailSuccess) {
          savedUser.emailSent = true;
          console.log('✅ Email sent');
        }
      }
    } catch (error) {
      console.error('❌ Email sending failed:', error.message);
    }

    // Update user status
    await savedUser.save();

    // Prepare response message
    let responseMessage = 'Registration successful!';
    if (idCardPath) {
      if (whatsappSuccess && emailSuccess) {
        responseMessage += ' Check WhatsApp and Email for your Digital ID Card.';
      } else if (whatsappSuccess) {
        responseMessage += ' Check WhatsApp for your Digital ID Card.';
      } else if (emailSuccess) {
        responseMessage += ' Check Email for your Digital ID Card.';
      } else {
        responseMessage += ' Your Digital ID Card has been generated. Contact support if you don\'t receive it.';
      }
    }

    res.status(201).json({
      success: true,
      message: responseMessage,
      registrationId: savedUser.registrationId,
      data: {
        fullName: savedUser.fullName,
        email: savedUser.email,
        phone: savedUser.phone,
        program: savedUser.program,
        registrationId: savedUser.registrationId
      }
    });

  } catch (error) {
    console.error('❌ Registration error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

module.exports = { registerUser };