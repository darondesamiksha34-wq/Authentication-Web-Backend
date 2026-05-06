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

const allowedOrigins = ["http://localhost:5173", "https://authentication-web-backend-production.up.railway.app"];

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












// import express from "express";
// import 'dotenv/config';
// import connectDB from "./config/mongodb.js";
// import cors from 'cors';
// import cookieParser from "cookie-parser";
// import authRouter from "./routes/authRoutes.js";

// const app = express();

// connectDB();

// const allowedOrigins = ['http://localhost:5173']
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({origin: allowedOrigins,credentials:true}));

// app.get("/",(req,res)=>{
//     console.log("Request send");
//     res.send("Server has started");
// })

// app.use('/api/auth',authRouter)
 
// app.listen(process.env.PORT,()=>
//     console.log(`Server is listening on port ${process.env.PORT}`));

