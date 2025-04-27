

import jwt from "jsonwebtoken";


const getTokenExpiry = async (req, res) => {
  const token = req.cookies.jwt; // Get the token from the cookie

  if (!token) {
    throw new Error("No token found in the cookie");
  }

  // Decode the token (without verifying it)
  const decoded = jwt.decode(token);

  if (!decoded) {
    throw new Error("Invalid token");
  }

  // Extract the expiration time (in seconds)
  const expirationTime = decoded.exp;
  res.json({ data: expirationTime });
};

export default getTokenExpiry;
