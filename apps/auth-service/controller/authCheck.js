// import jwt from "jsonwebtoken";

// const authCheck = async (req, res) => {
//   try {
//     // Retrieve the token from cookies or headers (choose as per your setup)
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res.json({ authenticated: false });
//     }

//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if (decoded) {
//       return res.json({ authenticated: true });
//     }
//   } catch (error) {
//     console.error("Authentication check error:", error);
//   }

//   // If verification fails or an error occurs
//   return res.json({ authenticated: false });
// };

// export default authCheck;


import jwt from "jsonwebtoken";

const authCheck = async (req, res) => {
  try {
    const token = req.cookies?.jwt; // Optional chaining to avoid errors

    if (!token) {
      return res.status(401).json({ authenticated: false, message: "No token provided" });
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({ authenticated: true,token: token });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ authenticated: false, message: "Token expired" });
      } else {
        return res.status(403).json({ authenticated: false, message: "Invalid token" });
      }
    }
  } catch (error) {
    console.error("Authentication check error:", error);
    return res.status(500).json({ authenticated: false, message: "Internal server error" });
  }
};

export default authCheck;
