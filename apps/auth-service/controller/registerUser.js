
// import userModel from "../models/userModel.js";
// import validator from "validator";
// import jwt from "jsonwebtoken";
// import nodemailer from "nodemailer";
// import axios from "axios";
// import client from "../config/redis.js";
// import generateToken, { validateMobileNumber, generateOTP } from "../utils/utils.js";

// const sendOtp = async (mobileNo, otp) => {
//   const url = "https://www.fast2sms.com/dev/bulkV2";
//   const params = new URLSearchParams({
//     authorization: process.env.FAST2SMS_API_KEY,
//     route: "otp",
//     variables_values: otp,
//     flash: "0",
//     numbers: mobileNo,
//   });

//   try {
//     const response = await axios.get(`${url}?${params}`);
//     console.log("Raw response from Fast2SMS:", response.data);
//     return response.data;
//   } catch (error) {
//     console.log("Error sending SMS:", error);
//     throw error;
//   }
// };

// const sendVerificationEmail = async (email,mobileNo, token) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const verificationUrl = `http://localhost:3000/verify/verify_email?token=${token}&email=${encodeURIComponent(email)}&mobileNo=${mobileNo}`;
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verify Your Email",
//     text: `Click on the following link to verify your email: ${verificationUrl}`,
//   };

//   return transporter.sendMail(mailOptions);
// };

// const registerUser = async (req, res) => {
//   const {name, mobileNo, email, registrationType } = req.body;

//   try {
    
//     const existingUser = await userModel.findOne({ $or: [{ mobileNo }, { email }] });

//     if (existingUser && existingUser.verified) {
//       return res.status(409).json({ status: false, message: "User already exists and is verified." });
//     }
//     // if (existingUser && !existingUser.verified) {
//     //   if (existingUser.mobileNo !== mobileNo || existingUser.email !== email) {
//     //     return res.status(400).json({ status: false, message: "Mobile number or email already registered. Complete verification." });
//     //   }
//     // }

//     // Handle Mobile Registration
//     if (registrationType === "mobileNo") {
//       if (!mobileNo || !validateMobileNumber(mobileNo)) {
//         return res.status(400).json({ status: false, message: "Provide a valid mobile number for registration." });
//       }

//       if (existingUser && !existingUser.verified) {
//         const otp = generateOTP().toString();
//         await sendOtp(mobileNo, otp);
//         await userModel.findOneAndUpdate(
//           { _id: existingUser._id },
//           { registrationType: "mobileNo" },
//           { new: true }
//         );

//         // const token = jwt.sign({ mobileNo }, process.env.JWT_SECRET, { expiresIn: "5m" });
//         // console.log(`Token for mobile number: ${token}`);
//         // res.cookie("authToken", token, { httpOnly: true, secure: false, sameSite: "Strict", maxAge: 5 * 60 * 1000 });
//         await client.set(mobileNo, otp, "EX", 300);
//       }

//       if (!existingUser) {
//         await new userModel({ name,mobileNo, email, registrationType, verified: false }).save();
//         const otp = generateOTP().toString();
//         await sendOtp(mobileNo, otp);

//         // const token = jwt.sign({ mobileNo }, process.env.JWT_SECRET, { expiresIn: "5m" });
//         // res.cookie("authToken", token, { httpOnly: true, secure: false, sameSite: "Strict", maxAge: 5 * 60 * 1000 });
//         await client.set(mobileNo, otp, "EX", 300);
//       }
      
//       const token = jwt.sign({ mobileNo }, process.env.JWT_SECRET, { expiresIn: "5m" });
//       return res.status(200).json({ status: true, message: "OTP sent successfully",token:token });
//     }

//     // Handle Email Registration
//     if (registrationType === "email") {
//       if (!email || !validator.isEmail(email)) {
//         return res.status(400).json({ status: false, message: "Provide a valid email for registration." });
//       }
//       if (existingUser && !existingUser.verified) {
//         await userModel.findOneAndUpdate(
//           { _id: existingUser._id },
//           { registrationType: "email" },
//           { new: true }
//         );

//         const token = generateToken(email);
//         await client.set(email, token, "EX", 300);
//         await sendVerificationEmail(email,mobileNo, token);
//         return res.status(200).json({ status: true, message: "Verification email sent successfully" });
//       }

//       if (!existingUser) {
//         const token = generateToken(email);
//         await client.set(email, token, "EX", 300);
//         await sendVerificationEmail(email,mobileNo, token);

//         await new userModel({name, mobileNo, email, registrationType, verified: false }).save();
//         return res.status(201).json({ status: true, message: "Verification email sent successfully" });
//       }
//     } else {
//       return res.status(400).json({ status: false, message: "Invalid registration type" });
//     }
//   } catch (error) {
//     console.log("Error during registration:", error);
//     return res.status(500).json({ status: false, message: "Internal server error" });
//   }
// };

// export default registerUser;


import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import axios from "axios";
import client from "../config/redis.js";
import generateToken, { validateMobileNumber, generateOTP } from "../utils/utils.js";

// Send OTP via SMS
const sendOtp = async (mobileNo, otp) => {
  try {
    const response = await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: process.env.FAST2SMS_API_KEY,
        route: "otp",
        variables_values: otp,
        flash: "0",
        numbers: mobileNo,
      },
    });
    console.log("SMS Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw new Error("Failed to send OTP");
  }
};

// Send Verification Email
const sendVerificationEmail = async (email, mobileNo, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const verificationUrl = `http://localhost:3000/verify/verify_email?token=${token}&email=${encodeURIComponent(email)}&mobileNo=${mobileNo}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      text: `Click to verify your email: ${verificationUrl}`,
    });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

// const registerUser = async (req, res) => {
//   const { name, mobileNo, email, registrationType } = req.body;

//   try {
//     const existingUser = await userModel.findOne({ $or: [{ mobileNo }, { email }] });

//     if (existingUser?.verified) {
//       return res.status(409).json({ status: false, message: "User already exists and is verified." });
//     }

//     // Mobile Registration
//     if (registrationType === "mobileNo") {
//       if (!validateMobileNumber(mobileNo)) {
//         return res.status(400).json({ status: false, message: "Invalid mobile number." });
//       }

//       const otp = generateOTP().toString();
//       await client.set(mobileNo, otp, "EX", 300);
//       await sendOtp(mobileNo, otp);

//       if (!existingUser) {
//         await new userModel({ name, mobileNo, email, registrationType, verified: false }).save();
//       } else {
//         await userModel.updateOne({ _id: existingUser._id }, { registrationType: "mobileNo" });
//       }

//       const token = jwt.sign({ mobileNo }, process.env.JWT_SECRET, { expiresIn: "5m" });
//       return res.status(200).json({ status: true, message: "OTP sent successfully", token });
//     }

//     // Email Registration
//     if (registrationType === "email") {
//       if (!validator.isEmail(email)) {
//         return res.status(400).json({ status: false, message: "Invalid email address." });
//       }

//       const token = generateToken(email);
//       await client.set(email, token, "EX", 300);
//       await sendVerificationEmail(email, mobileNo, token);

//       if (!existingUser) {
//         await new userModel({ name, mobileNo, email, registrationType, verified: false }).save();
//       } else {
//         await userModel.updateOne({ _id: existingUser._id }, { registrationType: "email" });
//       }

//       return res.status(200).json({ status: true, message: "Verification email sent successfully" });
//     }

//     return res.status(400).json({ status: false, message: "Invalid registration type" });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     return res.status(500).json({ status: false, message: "Internal server error" });
//   }
// };

// export default registerUser;
const registerUser = async (req, res) => {
  const { name, mobileNo, email, registrationType } = req.body;

  try {
    const existingUser = await userModel.findOne({ $or: [{ mobileNo }, { email }] });

    if (existingUser?.verified) {
      return res.status(409).json({ status: false, message: "User already exists and is verified." });
    }

    if (registrationType === "mobileNo") {
      if (!validateMobileNumber(mobileNo)) {
        return res.status(400).json({ status: false, message: "Invalid mobile number." });
      }

      const otp = generateOTP().toString();
      await client.set(mobileNo, otp, "EX", 300);
      await sendOtp(mobileNo, otp);

      if (!existingUser) {
        await new userModel({ name, mobileNo, email, registrationType, verified: false }).save();
      } else {
        await userModel.updateOne({ _id: existingUser._id }, { registrationType: "mobileNo" });
      }

      const token = jwt.sign({ mobileNo }, process.env.JWT_SECRET, { expiresIn: "5m" });
      return res.status(200).json({ status: true, message: "OTP sent successfully", token });
    }

    if (registrationType === "email") {
      if (!validator.isEmail(email)) {
        return res.status(400).json({ status: false, message: "Invalid email address." });
        
      }

      const token = generateToken(email);
      await client.set(email, token, "EX", 300);
      await sendVerificationEmail(email, mobileNo, token);

      if (!existingUser) {
        await new userModel({ name, mobileNo, email, registrationType, verified: false }).save();
      } else {
        await userModel.updateOne({ _id: existingUser._id }, { registrationType: "email" });
      }

      return res.status(200).json({ status: true, message: "Verification email sent successfully" });
    }

    return res.status(400).json({ status: false, message: "Invalid registration type" });
  } catch (error) {
    console.error("Registration Error:", error);
    return res.status(500).json({ status: false, message: "Internal server error", error: error.message });
  }
};

export default registerUser;
