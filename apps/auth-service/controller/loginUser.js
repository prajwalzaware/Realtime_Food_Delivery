// import userModel from "../models/userModel.js";
// import generateToken from "../utils/utils.js";
// import argon2 from "argon2";
// import validator from "validator";

// const loginUser = async (req, res) => {
//   const { username, password } = req.body; // Unified field 'username' instead of email/mobileNo

//   try {
//     let user;

//     // Check if the username is a valid email
//     if (validator.isEmail(username)) {
//       user = await userModel.findOne({ email: username });
//     }
//     // If not an email, treat it as a mobile number
//     else if (validator.isMobilePhone(username, "any", { strictMode: false })) {
//       user = await userModel.findOne({ mobileNo: username });
//     } else {
//       return res.json({
//         status: false,
//         message: "Invalid email or mobile number format",
//       });
//     }

//     // If user not found in the database
//     if (!user) {
//       return res.json({ status: false, message: "User does not exist" });
//     }

//     // Verify the password using argon2
//     const verifyPass = await argon2.verify(user.password, password);
//     if (!verifyPass) {
//       return res.json({ status: false, message: "Invalid credentials" });
//     }

//     // Generate JWT token for the user
//     let token = generateToken(user._id);
//     res.cookie("jwt", token, {
//       httpOnly: false, // Prevents client-side JS from accessing the cookie
//       secure: false,
//       sameSite: "Lax",
//       maxAge: 3600000,
//       // domain: "localhost", // 1 hour expiration
//     });

//     return res.json({ status: true, message: "User logged in successfully" });
//   } catch (error) {
//     console.error("Error during login:", error);
//     return res.json({
//       status: false,
//       message: "An error occurred during login",
//     });
//   }
// };

// export default loginUser;

import userModel from "../models/userModel.js";
import generateToken from "../utils/utils.js";
import argon2 from "argon2";
import validator from "validator";

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ status: false, message: "Username and password are required" });
    }

    let user;

    // Check if username is email or mobile number
    if (validator.isEmail(username)) {
      user = await userModel.findOne({ email: username });
    } else if (validator.isMobilePhone(username, "any", { strictMode: false })) {
      user = await userModel.findOne({ mobileNo: username });
    } else {
      return res.status(400).json({ status: false, message: "Invalid email or mobile number format" });
    }

    if (!user) {
      return res.status(401).json({ status: false, message: "User does not exist" });
    }

    // Verify password
    const verifyPass = await argon2.verify(user.password, password);
    if (!verifyPass) {
      return res.status(401).json({ status: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,  // Prevents XSS attacks
      secure: process.env.NODE_ENV === "production", // Ensures HTTPS in production
      sameSite: "Strict", // CSRF protection
      maxAge: 3600000, // 1 hour expiration
    });

    return res.status(200).json({ status: true, message: "User logged in successfully", token });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export default loginUser;

