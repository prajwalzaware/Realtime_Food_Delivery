// import jwt from "jsonwebtoken";
// import client from "../config/redis.js";
// import userModel from "../models/userModel.js"; // Assuming you have a user model

// const verify_mobileNo = async (req, res) => {
//   const { otp,mobileNo,email } = req.body;
  

//   // Check for the presence of the OTP
//   if (!otp || !mobileNo) {
//     return res.status(400).json({ success: false, message: "OTP and mobileNo is required" });
//   }

//   try {
//     // Fetch the OTP stored in Redis for the given mobile number
//     const storedOtp = await client.get(mobileNo);
//     if (!storedOtp) {
//       return res.status(404).json({ success: false, message: "OTP expired or invalid" });
//     }

//     // Compare the OTPs (both should be strings)
//     if (otp !== storedOtp) {
//       return res.status(401).json({ success: false, message: "Invalid OTP" });
//     }

//     // If the OTP is correct, delete it from Redis
//     await client.del(mobileNo);

//     // Update the user's mobile number verification status
//     const userUpdate = await userModel.findOneAndUpdate({ mobileNo,email }, { verified: true });
    
//     if (!userUpdate) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     console.log("Verification updated in the Database");

//     return res.status(200).json({ success: true, message: "Mobile number verified successfully" });

//   } catch (error) {
//     console.error("Error during verification:", error);
//     return res.status(500).json({ success: false, message: "Server error", error: error.message });
//   }
// };

// export default verify_mobileNo;

// import jwt from "jsonwebtoken";
// import client from "../config/redis.js";
// import userModel from "../models/userModel.js"; 

// const verify_mobileNo = async (req, res) => {
//   try {
//     const mobileNo = req.body.mobileNo?.trim();
//     const email = req.body.email?.trim();
//     const otp = req.body.otp?.trim();

//     // Validate required fields
//     if (!otp || !mobileNo || !email) {
//       return res.status(400).json({ success: false, message: "OTP, Mobile Number, and Email are required." });
//     }

//     // Fetch OTP from Redis
//     const storedOtp = await client.get(mobileNo);
//     if (!storedOtp) {
//       return res.status(410).json({ success: false, message: "OTP expired or invalid." });
//     }

//     // Validate OTP
//     if (otp !== storedOtp) {
//       return res.status(401).json({ success: false, message: "Invalid OTP." });
//     }

//     // OTP is valid, delete it from Redis
//     await client.del(mobileNo);

//     // Check if the user exists
//     const user = await userModel.findOne({ mobileNo, email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found." });
//     }

//     // Update user's verification status if not already verified
//     if (!user.verified) {
//       user.verified = true;
//       await user.save();
//     }

//     console.log(`Mobile verification successful for: ${mobileNo}`);

//     return res.status(200).json({ success: true, message: "Mobile number verified successfully." });
//   } catch (error) {
//     console.error("Error during verification:", error);
//     return res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
//   }
// };

// export default verify_mobileNo;


import jwt from "jsonwebtoken";
import crypto from "crypto";
import client from "../config/redis.js";
import userModel from "../models/userModel.js"; 

const verify_mobileNo = async (req, res) => {
  try {
    const mobileNo = req.body.mobileNo?.trim();
    const email = req.body.email?.trim();
    const otp = req.body.otp?.trim();

    // Validate required fields
    if (!otp || !mobileNo || !email) {
      return res.status(400).json({ success: false, message: "OTP, Mobile Number, and Email are required." });
    }

    // Fetch OTP from Redis
    const storedOtp = await client.get(mobileNo);
    if (!storedOtp) {
      return res.status(410).json({ success: false, message: "OTP expired or invalid." });
    }

    // Secure OTP comparison
    const isValidOtp = crypto.timingSafeEqual(Buffer.from(otp), Buffer.from(storedOtp));
    if (!isValidOtp) {
      return res.status(401).json({ success: false, message: "Invalid OTP." });
    }

    // OTP is valid, delete it from Redis
    await client.del(mobileNo);

    // Check if the user exists and update verification status
    const user = await userModel.findOneAndUpdate(
      { mobileNo, email, verified: false },
      { verified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found or already verified." });
    }

    console.log(`Mobile verification successful for: ${mobileNo}`);

    return res.status(200).json({ success: true, message: "Mobile number verified successfully." });
  } catch (error) {
    console.error("Error during verification:", error);
    return res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
};

export default verify_mobileNo;
