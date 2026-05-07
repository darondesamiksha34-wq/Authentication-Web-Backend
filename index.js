import express from "express";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", "https://authentication-web-xax2-pjjmzzou9.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  console.log("Server working");
  res.send("Server has started");
});

app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});









