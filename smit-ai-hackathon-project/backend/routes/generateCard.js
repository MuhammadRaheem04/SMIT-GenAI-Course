// backend/services/generateIDCard.js

const fs = require('fs');
const path = require('path');

async function generateIDCard(user) {
  // Path to uploads folder
  const uploadsDir = path.join(__dirname, '..', 'uploads');

  // Create uploads folder if it doesn't exist
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log('✅ Created uploads directory');
  }

  // Generate file name and path
  // Assuming your user has an 'id', otherwise use timestamp
  const fileName = `id-card-${user.id || Date.now()}.pdf`;
  const filePath = path.join(uploadsDir, fileName);

  // ====== Your PDF generation logic here ======
  // This is a placeholder example — replace it with your PDF code

  // Example: writing a simple text file as a dummy PDF (replace with real PDF code)
  fs.writeFileSync(filePath, `ID Card PDF for ${user.fullName}`);

  // Return the full file path
  return filePath;
}

module.exports = generateIDCard;

