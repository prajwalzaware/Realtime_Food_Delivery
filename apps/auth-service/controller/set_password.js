// import userModel from "../models/userModel.js";
// import argon2 from "argon2";
// import validator from "validator";

// const set_password = async ({ body: { email, mobileNo, password } }, res) => {
//   try {
//     // Validate input
//     if (!email || !mobileNo || !password) {
//       return res.status(400).json({
//         status: false,
//         message: "Email,MobileNo and Password are required.",
//       });
//     }

//     // Hash the new password
//     const hash = await argon2.hash(password, { type: argon2.argon2id });

//     // Determine the user based on whether the username is an email or mobile number
//     // const query = validator.isEmail(username)
//     //   ? { email: username }
//     //   : validator.isMobilePhone(username, "any", { strictMode: false })
//     //   ? { mobileNo: username }
//     //   : null;

//     // If query is invalid, return a response
//     // if (!query) {
//     //   return res.status(400).json({
//     //     status: false,
//     //     message: "Invalid email or mobile number format",
//     //   });
//     // }

//     // Update the user's password
//     const user = await userModel.findOneAndUpdate(
//        {email,mobileNo},
//       { password: hash },
//       { new: true }
//     );

//     // If no user was found
//     if (!user) {
//       return res.status(404).json({
//         status: false,
//         message: "User not found",
//       });
//     }

//     // Successfully updated password
//     return res.status(200).json({
//       status: true,
//       message: "Password updated successfully",
//       user: { email: user.email, mobileNo: user.mobileNo }, // Optional: return some user info
//     });
//   } catch (error) {
//     console.error("Error updating password:", error);
//     return res.status(500).json({
//       status: false,
//       message: "An error occurred during the password update",
//       error: error.message, // Optionally include the error message for debugging
//     });
//   }
// };

// export default set_password;

import userModel from "../models/userModel.js";
import argon2 from "argon2";
import validator from "validator";

const set_password = async (req, res) => {
  try {
    const { email, mobileNo, password } = req.body;

    // Validate input
    if (!password || (!email && !mobileNo)) {
      return res.status(400).json({
        status: false,
        message: "Password and either email or mobile number are required.",
      });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid email format." });
    }

    if (mobileNo && !validator.isMobilePhone(mobileNo, "any", { strictMode: false })) {
      return res.status(400).json({ status: false, message: "Invalid mobile number format." });
    }

    // Find user by email or mobile number
    const user = await userModel.findOne({ $or: [{ email }, { mobileNo }] });

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found." });
    }

    if (!user.verified) {
      return res.status(403).json({ status: false, message: "User is not verified. Complete verification first." });
    }

    // Hash new password
    const hash = await argon2.hash(password, { type: argon2.argon2id });

    // Update password
    await userModel.updateOne({ _id: user._id }, { password: hash });

    return res.status(200).json({ status: true, message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error);
    return res.status(500).json({ status: false, message: "Internal server error." });
  }
};

export default set_password;

