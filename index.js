// import express from "express";
// import "dotenv/config";
// import connectDB from "./config/mongodb.js";
// import cors from "cors";
// import cookieParser from "cookie-parser";
// import authRouter from "./routes/authRoutes.js";

// const app = express();

// connectDB();

// app.use(express.json());
// app.use(cookieParser());

// const allowedOrigins = ["http://localhost:5173", "https://authentication-web-xax2-e4u5oosov.vercel.app"];

// // app.use(
// //   cors({
// //     origin: allowedOrigins,
// //     credentials: true,
// //   })
// // );
// app.use(
//   cors({
//     origin: [
//       "http://localhost:5173",
//       "https://authentication-web-xax2.vercel.app",
//     ],
//     credentials: true,
//   })
// );

// app.get("/", (req, res) => {
//   console.log("Server working");
//   res.send("Server has started");
// });

// app.use("/api/auth", authRouter);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });





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

const allowedOrigins = [
  "http://localhost:5173",
  "https://authentication-web-xax2-e4u5oosov.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // allow requests with no origin
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },

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



