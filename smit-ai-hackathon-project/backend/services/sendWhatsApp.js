const axios = require('axios');
const fs = require('fs');

const sendWhatsApp = async (user, idCardPath) => {
  try {
    // Check if required environment variables are set
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    
    if (!accessToken || !phoneNumberId) {
      console.warn('⚠️ WhatsApp credentials not configured. Please set WHATSAPP_ACCESS_TOKEN and WHATSAPP_PHONE_NUMBER_ID in .env file');
      return false;
    }

    // Format phone number (ensure it starts with country code)
    let phoneNumber = user.phone;
    if (phoneNumber.startsWith('03')) {
      phoneNumber = '92' + phoneNumber.substring(1); // Convert Pakistan format
    } else if (!phoneNumber.startsWith('92')) {
      phoneNumber = '92' + phoneNumber; // Add Pakistan country code
    }

    const url = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
    
    // First send a text message
    const textMessage = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'text',
      text: {
        preview_url: false,
        body: `🎉 Congratulations ${user.fullName}!\n\nYour registration for *${formatProgram(user.program)}* at Saylani Mass IT Training has been successful!\n\n📋 Registration ID: *${user.registrationId}*\n📧 Email: ${user.email}\n📱 Phone: ${user.phone}\n\n📄 Your Digital ID Card is attached below. Please save it for future reference.\n\n🚀 Welcome to Pakistan's largest IT training program!\n\n*Saylani Mass IT Training*\nBuilding careers, transforming lives.`
      }
    };

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    };

    // Send text message
    const textResponse = await axios.post(url, textMessage, { headers });
    console.log('✅ WhatsApp text message sent successfully');

    // Note: For document sending, you would need to upload the file first
    // This is a simplified version - in production, you'd need to:
    // 1. Upload the PDF to Facebook's servers
    // 2. Get the media ID
    // 3. Send the document using the media ID

    console.log('📄 WhatsApp document sending would require file upload to Facebook servers');
    console.log('💡 For now, sending confirmation message only');

    return true;

  } catch (error) {
    console.error('❌ WhatsApp sending failed:', error.response?.data || error.message);
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

module.exports = sendWhatsApp;