// backend/server.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'https://daminko-phone-store-front.onrender.com'
}));
app.use(express.json());

// Route to receive orders from the frontend
app.post('/order', async (req, res) => {
  const { name, phone, address, email, cart } = req.body;

  // Basic validation
  if (!name || !phone || !address || !email || !Array.isArray(cart)) {
    return res.status(400).json({ success: false, message: 'Invalid order data' });
  }

  const formattedCart = cart.map(item => `${item.name} - R${item.price}`).join('\n');

  // Email transporter setup using environment variables
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: '📦 New Order from DaMinko Store',
    text: `
New Order Received:

Name: ${name}
Email: ${email}
Phone: ${phone}
Address: ${address}

Order Items:
${formattedCart}
    `
  };

  // Send the email
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
