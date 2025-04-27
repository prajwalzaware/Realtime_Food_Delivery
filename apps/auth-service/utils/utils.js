import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "20m" });
};



export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const validateMobileNumber = (mobileNumber) => {
  // Check for 10-digit number
  const tenDigitRegex = /^\d{10}$/;

  // Check for 12-digit number starting with 91
  const twelveDigitRegex = /^91\d{10}$/;

  // Check for 13-digit number starting with +91
  const thirteenDigitRegex = /^\+91\d{10}$/;

  return (
    tenDigitRegex.test(mobileNumber) ||
    twelveDigitRegex.test(mobileNumber) ||
    thirteenDigitRegex.test(mobileNumber)
  );
};


export default generateToken;
