const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const generateIDCard = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Define file path
      const fileName = `id-card-${user.registrationId}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      // Create PDF document
      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Colors
      const primaryColor = '#2563EB';
      const secondaryColor = '#64748B';
      const backgroundColor = '#F8FAFC';

      // Header Section
      doc.rect(0, 0, doc.page.width, 100).fill(primaryColor);
      
      // Logo area (placeholder)
      doc.circle(80, 50, 25).fill('white');
      doc.fontSize(16).fillColor('white').text('SYL', 65, 44);

      // Title
      doc.fontSize(24).fillColor('white').text('SAYLANI MASS IT TRAINING', 140, 30);
      doc.fontSize(14).fillColor('white').text('DIGITAL STUDENT ID CARD', 140, 55);

      // Student Photo placeholder
      doc.rect(50, 140, 120, 150).stroke(primaryColor).lineWidth(2);
      doc.fontSize(12).fillColor(secondaryColor).text('STUDENT PHOTO', 85, 210, { align: 'center' });

      // Student Information
      let yPosition = 140;
      const leftColumn = 200;

      doc.fontSize(16).fillColor('#000000').text('STUDENT INFORMATION', leftColumn, yPosition);
      yPosition += 30;

      // Student details
      const details = [
        { label: 'Full Name:', value: user.fullName },
        { label: 'Registration ID:', value: user.registrationId },
        { label: 'CNIC:', value: user.cnic },
        { label: 'Email:', value: user.email },
        { label: 'Phone:', value: user.phone },
        { label: 'Program:', value: formatProgram(user.program) },
        { label: 'Registration Date:', value: new Date(user.createdAt).toLocaleDateString() }
      ];

      details.forEach(detail => {
        doc.fontSize(11).fillColor(secondaryColor).text(detail.label, leftColumn, yPosition);
        doc.fontSize(11).fillColor('#000000').text(detail.value, leftColumn + 100, yPosition);
        yPosition += 20;
      });

      // Generate QR Code
      const qrData = JSON.stringify({
        name: user.fullName,
        id: user.registrationId,
        program: user.program,
        issued: new Date().toISOString()
      });

      try {
        const qrCodeBuffer = await QRCode.toBuffer(qrData, { 
          width: 100,
          margin: 1,
          color: {
            dark: primaryColor,
            light: '#FFFFFF'
          }
        });

        // Add QR code to PDF
        doc.image(qrCodeBuffer, 420, 140, { width: 100 });
        doc.fontSize(10).fillColor(secondaryColor).text('Scan QR Code', 440, 250, { align: 'center' });
        doc.text('for verification', 440, 262, { align: 'center' });
      } catch (qrError) {
        console.warn('QR Code generation failed:', qrError.message);
        doc.fontSize(10).fillColor(secondaryColor).text('QR Code', 440, 200, { align: 'center' });
        doc.text('Generation Failed', 440, 212, { align: 'center' });
      }

      // Footer Section
      const footerY = 350;
      doc.rect(0, footerY, doc.page.width, 80).fill(backgroundColor);
      
      doc.fontSize(12).fillColor(primaryColor).text('VALIDITY & TERMS', 50, footerY + 15);
      doc.fontSize(9).fillColor(secondaryColor)
         .text('• This digital ID card is valid for the duration of the enrolled program', 50, footerY + 35)
         .text('• Present this card for all training sessions and assessments', 50, footerY + 50)
         .text('• Contact support@saylani.org for any queries or verification', 50, footerY + 65);

      // Institution details
      doc.fontSize(10).fillColor(primaryColor).text('SAYLANI MASS IT TRAINING', 350, footerY + 20);
      doc.fontSize(8).fillColor(secondaryColor)
         .text('Pakistan\'s Largest IT Training Program', 350, footerY + 35)
         .text('Email: support@saylani.org', 350, footerY + 50)
         .text('Phone: +92-21-111-729-526', 350, footerY + 65);

      // Issue date and signature
      doc.fontSize(8).fillColor(secondaryColor)
         .text(`Issued on: ${new Date().toLocaleDateString()}`, 50, 500)
         .text('Digital Signature: Verified', 350, 500);

      // Add watermark
      doc.fontSize(60).fillColor('#000000').opacity(0.05)
         .text('SAYLANI', 200, 300, { rotate: -45, align: 'center' });

      // Finalize PDF
      doc.end();

      stream.on('finish', () => {
        console.log(`✅ ID Card generated: ${fileName}`);
        resolve(filePath);
      });

      stream.on('error', (error) => {
        console.error('❌ PDF generation error:', error);
        reject(error);
      });

    } catch (error) {
      console.error('❌ ID Card generation failed:', error);
      reject(error);
    }
  });
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

module.exports = generateIDCard;