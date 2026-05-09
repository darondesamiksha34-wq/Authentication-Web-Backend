import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import usermodel from '../models/usermodel.js';
import { sendemail, transporter } from '../config/nodeMailer.js';
import { text } from 'express';

export const register = async(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.json({sucess: false,message: "Details are missing"})
    }
    try{
        const existingUser = await usermodel.findOne({email});
        if(existingUser){
            return res.json({success: false,message: "user already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new usermodel({name,email,password: hashedPassword});
        await user.save();
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn: '7d'});
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?'none' : 'strict',
            maxAge: 7*24*60*60*1000
        })
        const subject = 'Welcome to CodeMate.';
        const text = `Welcome to AUTHENTICATION APP. Your account has been created with email id:${email}`;
        // await sendemail({email,subject,text});
        // const mailOption ={
        //     from: process.env.SENDER_EMAIL,

        
        //     to: email,
        //     subject:`Welcome to AUTHENTICATION APP. Your account has been created with email id:${email}`
        // }
        // await transporter.sendMail(mailOption);
        
        return res.json({
            success: true,
            user: {
            name: user.name,
            email: user.email
        }
    });
    }
    catch(error){
        res.json({success:false , message: error.message})
    }
}

export const login = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.json({success:false,message:"Email and Password are required"})
    }
    try{
        const user = await usermodel.findOne({email});
        if(!user){
            return res.json({success:false,message:"Invalid Email"})
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid Password"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production'?'none' : 'strict',
            maxAge: 7*24*60*60*1000
        })
        return res.json({success: true});
    }
    catch(error){
        res.json({success:false , message: error.message})
    }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.json({
      success: true,
      message: "Logged Out",
    });

  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


export const sendVerifyOtp = async(req,res)=>{
    try{
        const {userID} = req.body;
        const user = await usermodel.findById(userID);
        if(user.isAccountVerified){
            return res.json({success: false,message:"Account Already Verified"})
        }
        const otp = String(Math.floor(100000+Math.random()*900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + 24*60*60*1000
        await user.save();
        const sendemail = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Welcome to AUTHENTICATION APP. Your OTP is ${otp}. Verify you account using this OTP`
        }
        await transporter.sendMail(sendemail);
        res.json({success: true, message: "Verification OTP sent on Email"});
    }catch(error){
        res.json({
            success:false,message:error.message
        })
    }
}


export const verifyEmail = async(req,res)=>{
    const {userID , otp} = req.body;
    if(!userID || !otp){
        return res.json({success:false,message:'Missing Details'});
    }
    try{
        const user = await usermodel.findById(userID);
        if(!user){
            return res.json({success: false, message:'User not found'});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success:false,message:'Invalid OTP'});
        }
        if(user.verifyOtpExpiredAt < Date.now()){
            return res.json({success: false,message: 'OTP Expired'})
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;
        await user.save();
        return res.json({success: true,message:'Email Verified Successfully'})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const isAuthenticated = async(req,res)=>{
    try{
        return res.json({success:true})
    }catch(error){
        res.json({success:false,message:error.message})
    }
}

export const sendResetOtp = async(req,res)=>{
    const{email} = req.body;
    if(!email){
        return res.json({success:false,message:'Email is required'})
    }
    try {
   console.log("Sending OTP to:", user.email);

   const info = await transporter.sendMail(sendemail);

   console.log("Mail sent:", info.response);

   res.json({
      success:true,
      message:"Password reset OTP sent on Email"
   });

} catch(error) {
   console.log("EMAIL ERROR:", error);

   res.json({
      success:false,
      message:error.message
   });
}
//     try{
//         const user = await usermodel.findOne({email});
//         if(!user){
//             return res.json({success:false,message:'User not found'})
//         }
//         const otp = String(Math.floor(100000 + Math.random()*900000));
//         user.resetOtp = otp;
//         user.resetOtpExpiredAt = Date.now() + 15*60*1000
//         await user.save();
//         const sendemail = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject:'Password reset OTP received',
//             text:`Welcome to AUTHENTICATION APP. Your OTP for resetting your password is ${otp}.Use this OTP to proceed with resetting your Password`   
//         }
//         await transporter.sendMail(sendemail);
//         res.json({success:true,message:"Password reset OTP sent on Email"})
//     }
//     catch(error){
//         res.json({success:false,message:error.message})
//     }
// }

export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword} = req.body;

    if(!email||!otp||!newPassword){
        return res.json({success: false,message:'Email,OTP ad New Password are required'});
    }
    try{
        const user = await usermodel.findOne({email});
        if(!user){
            return res.json({success:false,message:'User not Found'})
        }
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success:false,message:'Invalid OTP'})
        }
        if(user.resetOtpExpiredAt < Date.now()){
            return res.json({success: false,message: 'OTP Expired'})
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;

        await user.save();
        return res.json({success:true,message:'Password has been reset successfully'});
    }catch(error){
        res.json({success:false,message:error.message})
    }
}





