import mongoose from "mongoose";

// Function to connect to MongoDB
export const connectDB = async () => {
  const mongooseOptions = {
    serverSelectionTimeoutMS: 50000, // Time out after 50 seconds if unable to connect to the primary server
    socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
  };

  const connectWithRetry = async () => {
    try {
      // Attempt to connect to MongoDB using the provided URI and options
      await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
      console.log("DB Connected successfully...");
    } catch (error) {
      console.error("Error in connecting to the database:", error);

      // Retry the connection after 5 seconds if it fails
      console.log("Retrying MongoDB connection in 5 seconds...");
      setTimeout(connectWithRetry, 2000);
    }
  };

  // Initiate the connection with retry logic
  connectWithRetry();
};

const db = mongoose.connection;

db.on('connected', () => console.log('Mongoose connected to DB.'));
db.on('error', (err) => console.error('Mongoose connection error:', err));
db.on('disconnected', () => console.log('Mongoose disconnected.'));

