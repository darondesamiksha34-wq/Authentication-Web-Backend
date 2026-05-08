import express from "express";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";

const app = express();

// ✅ Connect DB safely
connectDB();

app.use(express.json());
app.use(cookieParser());

// ✅ CORS (correct)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://authentication-web-xax2.vercel.app",
    ],
    credentials: true,
  })
);

// ✅ Health route (IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.send("Server has started");
});

// ✅ Routes
app.use("/api/auth", authRouter);

// ✅ FIXED PORT HANDLING
const PORT = process.env.PORT;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening on port ${PORT}`);
});