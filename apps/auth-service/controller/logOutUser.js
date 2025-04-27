const logOutUser = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: false,
    sameSite: "Lax",
  });
  res.status(200).json({ message: "Successfully logged out" });
};

export default logOutUser;

// const logOutUser = async (req, res) => {
//   try {
//     res.clearCookie("jwt", {
//       httpOnly: true, // Prevents client-side access
//       secure: false,
//       // secure: process.env.NODE_ENV === "production", // Enforces HTTPS in production
//       // sameSite: "Strict", // Stronger CSRF protection
//       sameSite: "Lax", // Stronger CSRF protection
//       path: "/", // Ensures cookie is removed globally
//     });

//     return res.status(200).json({ success: true, message: "Successfully logged out." });
//   } catch (error) {
//     console.error("Error during logout:", error);
//     return res.status(500).json({ success: false, message: "Logout failed.", error: error.message });
//   }
// };

// export default logOutUser;
