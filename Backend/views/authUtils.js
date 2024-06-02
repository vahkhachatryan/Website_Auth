// const express = require('express');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');

// const app = express();

// // Middleware to parse JSON bodies
// app.use(express.json());

// // POST endpoint for user registration
// app.post('/register', (req, res) => {
//     // Extract user data from request body
//     const {email, uID } = req.body;

//     // Generate JWT containing user information
//     const token = jwt.sign({ email, uID }, 'your_secret_key', { expiresIn: '1h' });

//     // Create activation link with token as query parameter
//     const activationLink = `http://your-domain.com/activation?token=${token}`;

//     // Nodemailer transporter configuration
//     const transporter = nodemailer.createTransport({
//         host: 'smtp.mail.ru',
//         port: 465,
//         secure: true, // Use SSL/TLS
//         auth: {
//             user: 'vahe.khachatryan0308@mail.ru', // Your Mail.ru email address
//             pass: 'v00a61h04e' // Your Mail.ru email password
//         }
//     });

//     // Email options
//     const mailOptions = {
//         from: 'vahe.khachatryan0308@mail.ru',
//         to: 'vahekhachatryan00@gmail.com',
//         subject: 'Activate Your Account',
//         html: `<p>Click the following link to activate your account:</p><p><a href="${activationLink}">${activationLink}</a></p>`
//     };

//     // Send email
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log('Error sending email:', error);
//             res.status(500).json({ error: 'Failed to send activation email' });
//         } else {
//             console.log('Email sent:', info.response);
//             res.status(201).json({ message: 'Activation link sent to your email' });
//         }
//     });
// });

// // Endpoint to handle user activation
// app.get('/activation', (req, res) => {
//     // Extract token from query parameter
//     const token = req.query.token;

//     // Verify token
//     jwt.verify(token, 'your_secret_key', (err, decoded) => {
//         if (err) {
//             console.log('Token verification failed:', err);
//             res.status(400).json({ error: 'Invalid or expired token' });
//         } else {
//             // Activate user account (replace with your activation logic)
//             console.log('User activated:', decoded.email);
//             res.status(200).json({ message: 'User activated successfully' });
//         }
//     });
// });

// // Start the server
// const PORT = process.env.PORT || 3003;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
