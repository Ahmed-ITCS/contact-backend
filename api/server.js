require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Namecheap SMTP configuration
const transporter = nodemailer.createTransport({
  host: 'mail.privateemail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.NAMECHEAP_EMAIL,
    pass: process.env.NAMECHEAP_PASSWORD
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.NAMECHEAP_EMAIL}>`, // Use your authenticated email
      to: 'info@highstreetaccountax.com',
      replyTo: email, // Let replies go to the user's email
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong> ${message}</p>`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
