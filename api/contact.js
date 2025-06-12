import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, phone, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NAMECHEAP_EMAIL,
      pass: process.env.NAMECHEAP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${name}" <${process.env.NAMECHEAP_EMAIL}>`,
      to: 'info@highstreetaccountax.com',
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage: ${message}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Phone:</strong> ${phone}</p>
             <p><strong>Message:</strong> ${message}</p>`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
}
