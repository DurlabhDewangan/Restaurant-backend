import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Reservation endpoint
app.post('/send-reservation', async (req, res) => {
  const { fullName, email, phone, guests, date, time, notes } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Reservation Bot" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: 'New Table Reservation Request',
    text: `
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Guests: ${guests}
Date: ${date}
Time: ${time}
Notes: ${notes || 'None'}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Reservation email sent!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send reservation email.', error });
  }
});

// Contact form endpoint
app.post('/send-contact', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Contact Form" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `New Contact Form Submission: ${subject}`,
    text: `
Name: ${name}
Email: ${email}
Phone: ${phone || 'N/A'}
Subject: ${subject}
Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Contact email sent!' });
  } catch (error) {
    console.error('Error sending contact email:', error);
    res.status(500).json({ message: 'Failed to send contact email.', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
