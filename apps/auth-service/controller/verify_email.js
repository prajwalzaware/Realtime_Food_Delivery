// import client from "../config/redis.js"; // Ensure your Redis client is imported
// import userModel from "../models/userModel.js"; // Import your user model

// const verify_email = async ({ query: { token, email,mobileNo} }, res) => {
//   try {
//     // Check if both token and email are provided
//     if (!token || !email || !mobileNo) {
//       return res.status(400).json({
//         status: false,
//         message: "Missing token or email, mobileNo for verification",
//       });
//     }

//     // Check if token exists in Redis
//     const storedToken = await client.get(email);
//     if (!storedToken) {
//       return res.status(401).json({
//         status: false,
//         message: "Verification link expired or invalid",
//       });
//     }

//     // Check if the token matches
//     if (storedToken !== token) {
//       return res.status(401).json({
//         status: false,
//         message: "Invalid verification link",
//       });
//     }

//     // Delete the token from Redis after successful verification
//     await client.del(email);

//     // Check if the user exists before updating
//     const user = await userModel.findOne({ email,mobileNo });
//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         message: "User not found",
//       });
//     }

//     // Update the user's verified status in the database
//     user.verified = true;
//     await user.save();
//     console.log(`Verification status updated for ${email} in the Database`);

//     return res.status(200).json({
//       status: true,
//       message: "Email verified successfully",
//     });
//   } catch (error) {
//     console.error("Error verifying email:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal server error while verifying email",
//       error: error.message, // Optionally include the error message for debugging
//     });
//   }
// };

// export default verify_email;

import client from "../config/redis.js"; 
import userModel from "../models/userModel.js"; 

const verify_email = async ({ query: { token, email, mobileNo } }, res) => {
  try {
    if (!token || !email || !mobileNo) {
      return res.status(400).json({ status: false, message: "Missing token, email, or mobileNo for verification" });
    }

    const storedToken = await client.get(email);
    if (!storedToken || storedToken !== token) {
      return res.status(401).json({ status: false, message: "Invalid or expired verification link" });
    }

    await client.del(email); // Remove token from Redis after successful verification

    const user = await userModel.findOne({ email, mobileNo });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    if (user.verified) {
      return res.status(200).json({ status: true, message: "Email already verified" });
    }

    user.verified = true;
    await user.save();

    return res.status(200).json({ status: true, message: "Email verified successfully" });

  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ status: false, message: "Internal server error while verifying email" });
  }
};

export default verify_email;
