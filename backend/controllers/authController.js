const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

require("dotenv").config();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { 
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

//  REGISTER
exports.register = async (req, res) => {
  const { name, email, password, phone, role } = req.body;
  try {
    if (!name || !email || !password || !phone || !role)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "24h" });
    const verifyURL = `http://localhost:5000/api/auth/verify/${token}`;

    await transporter.sendMail({
      from: `"MyApp Auth" <${process.env.EMAIL_ID}>`,
      to: email,
      subject: "Verify your email",
      html: `<h3>Hello ${name}</h3><p>Click below to verify your email:</p><a href="${verifyURL}" 
      style="color:blue;">Verify Email</a>`,
    });

    res.status(201).json({ message: "Registered successfully! Check your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//  EMAIL VERIFICATION 
exports.verifyEmail = async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    await User.findByIdAndUpdate(decoded.id, { isVerified: true });
    res.send("Email verified successfully! You can now log in.");
  } catch (err) {
    res.status(400).send("Invalid or expired verification link.");
  }
};

//    LOGIN 
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
       return res.status(400).json("User not found");
    if (!user.isVerified)
       return res.status(400).json("Email not verified");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json("Incorrect password");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000; 
    await user.save();

    await transporter.sendMail({
      from: `"MyApp OTP" <${process.env.EMAIL_ID}>`,
      to: user.email,
      subject: "Your Login OTP Code",
      html: `<h3>Your Login OTP</h3><p>Your OTP code is: <b>${otp}</b></p><p>This OTP will expire in 10 minutes.</p>`,
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  VERIFY OTP 
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.otp = null;
    user.otpExpiry = null;

    const accessToken = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "2hr" });      //   onlu adding role
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", accessToken });
  } catch (err) {
    console.error("Error verifying OTP:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  REFRESH TOKEN 
exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) return res.status(403).json({ message: "Invalid token" });

    const newAccessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

//   LOGOUT
exports.logout = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;
    if (token) {
      const user = await User.findOne({ refreshToken: token });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("refreshToken", { httpOnly: true, sameSite: "lax", secure: false });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};