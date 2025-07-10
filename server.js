// backend/server.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 3000; // You can change this if needed

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to read JSON data from requests

// Route to receive orders from the frontend
app.post('/order', async (req, res) => {
  const { name, phone, address, cart } = req.body;

  if (!name || !phone || !address || !Array.isArray(cart)) {
    return res.status(400).json({ success: false, message: 'Invalid order data' });
  }

  const formattedCart = cart.map(item => `${item.name} - R${item.price}`).join('\n');

  // Email transporter setup (using Gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'daminkocreations@gmail.com',      // ⬅️ Replace this with your Gmail
      pass: 'obfkxyqkrujxcdkk'          // ⬅️ Use Gmail app password, NOT your regular password
    }
  });

  const mailOptions = {
    from: 'daminkocreations@gmail.com',        // ⬅️ Same as above
    to: 'daminkocreations@gmail.com',          // ⬅️ Can be the same or a different destination
    subject: '📦 New Order from DaMinko Store',
    text: `
New Order Received:

Name: ${name}
Phone: ${phone}
Address: ${address}

Order Items:
${formattedCart}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Order email sent!");
    res.json({ success: true, message: 'Order sent successfully' });
  } catch (err) {
    console.error("❌ Failed to send email:", err);
    res.status(500).json({ success: false, message: 'Email sending failed' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
