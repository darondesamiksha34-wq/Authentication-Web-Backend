import mongoose from "mongoose";
import 'dotenv/config';

const connectDB = async () => {
  try {
    console.log("Connecting to DB...");

    await mongoose.connect(process.env.MONGODB_Atlas_URI);

    console.log("Database Connected");

  } catch (error) {
    console.log("DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;



























// import mongoose from "mongoose";
// import 'dotenv/config'

// const connectDB = async()=>{
//     mongoose.connection.on('connected',()=>
//     console.log("Database Connected"));
//     await mongoose.connect(process.env.MONGODB_Atlas_URI,{useNewUrlParser:true});
    
// }
// export default connectDB;



