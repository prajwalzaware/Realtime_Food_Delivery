import mongoose from "mongoose";
import validator from "validator";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name:{
    type:String
  },
    mobileNo: {
      type: String,
      required: [true, "Mobile number is required"],
      // unique: true,
      sparse: true, // Allow unique values but skip null values for unique constraint
      validate: {
        validator: function (v) {
          return /^(?:\+?1\s*(?:[.-]\s*)?)?(?!(?:.*[.-]\s*){2})\(?\d{3}\)?\s*[.-]?\s*\d{3}\s*[.-]?\s*\d{4}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid mobile number!`,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      // unique: true,
      sparse: true, // Ensure only unique, non-null values for emails
      validate: {
        validator: (v) => validator.isEmail(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      validate: {
        validator: (v) => 
          v && v.length >= 8 && /[A-Z]/.test(v) && /[!@#\$%\^\&*\)\(+=._-]/.test(v), // Enforce strong passwords
        message: "Password must be at least 8 characters long, with an uppercase letter, number, and special character.",
      },
    },
    registrationType: {
      type: String,
      required: true,
      enum: ['email', 'mobileNo'], // Restrict to 'email' or 'mobileNo'
    },
    verified: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    minimize: false,
    timestamps: true, // Manage createdAt and updatedAt timestamps
  }
);

// Unique index for non-null mobileNo and email
userSchema.index({ mobileNo: 1, email: 1 }, { unique: true, sparse: true });

// Model initialization
const userModel = mongoose.models.user || mongoose.model("user", userSchema);


export default userModel;
