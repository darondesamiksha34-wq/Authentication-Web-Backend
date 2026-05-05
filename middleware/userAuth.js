import jwt from "jsonwebtoken"
const userAuth = async(req , res , next)=>{
    const{token}=req.cookies;
    if(!token){
        return res.json({success: false, message:'OTP Verified'})
    }try{
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.body.userID = tokenDecode.id;
            console.log(req.body.userID);
        }else{
            return res.json({success:true,message:'Not Authorized... Login again'})
        }
        next();
    }catch(error){
        res.json({success:false,message:error.message})
    }
}
export default userAuth;
















// import jwt from "jsonwebtoken";

// const userAuth = async (req, res, next) => {
//   try {
//     let token;

  
//     if (req.cookies?.token) {
//       token = req.cookies.token;
//     }

//     if (!token && req.headers.authorization) {
//       token = req.headers.authorization.split(" ")[1];
//     }

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "Not Authorized... Login again",
//       });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
//     req.userId = decoded.id;

//     next();

//   } catch (error) {
//     return res.status(401).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export default userAuth;













