import express from "express";
import http from "http";
import { connectDB } from "./config/db.js";
import router from "./routes/routes.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import client from "./config/redis.js";

dotenv.config();

const PORT = process.env.AUTH_SERVICE_PORT || 3000;
dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);

const startServer = async () => {
  try {
    await connectDB();

    await client.connect();

    app.use("/", router);

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1); 
  }
};

startServer(); 
