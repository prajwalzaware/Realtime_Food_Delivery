// import userModel from "../models/userModel.js";

// const profileDetails = async (req, res) => {
// //   console.log(req.body);
//   const responce = await userModel.findById(req.body.userId);
// //   console.log(responce.name);
//   return res.json({data:responce, message: "this is profile" });
// };
// export default profileDetails;


import userModel from "../models/userModel.js";

const profileDetails = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Fetch user details (excluding password)
    const user = await userModel.findById(userId).select("-password");
    
    // Handle user not found
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({ success: true, data: user, message: "Profile details retrieved successfully." });

  } catch (error) {
    console.error("Error fetching profile details:", error);
    return res.status(500).json({ success: false, message: "Internal server error.", error: error.message });
  }
};

export default profileDetails;
