// import userModel from "../models/userModel.js";

// const checkEmailVerified = async ({ query: { email, mobileNo } }, res) => {
//   try {
//     if (!email || !mobileNo) {
//       return res.json({
//         status: false,
//         message: "Email and MobileNo required",
//       });
//     }

//     // Find one user with the matching email and mobile number
//     const user = await userModel.findOne({ email, mobileNo });
    
//     if (!user) {
//       return res.json({
//         status: false,
//         message: "User not found",
//       });
//     }

//     if (user.verified) {
//       return res.json({ status: true, message: "Mail is Verified" });
//     } else {
//       return res.json({
//         status: false,
//         message: "Mail is not verified",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       status: false,
//       message: "An error occurred while checking email verification",
//     });
//   }
// };

// export default checkEmailVerified;


import userModel from "../models/userModel.js";

const checkEmailVerified = async (req, res) => {
  try {
    const { email, mobileNo } = req.query;

    if (!email || !mobileNo) {
      return res.status(400).json({
        status: false,
        message: "Email and MobileNo are required.",
      });
    }

    // Find the user with the matching email and mobile number
    const user = await userModel.findOne({ email, mobileNo }).lean();

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      status: user.verified,
      message: user.verified ? "Email is verified." : "Email is not verified.",
    });

  } catch (error) {
    console.error("Error checking email verification:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error while checking email verification.",
    });
  }
};

export default checkEmailVerified;
