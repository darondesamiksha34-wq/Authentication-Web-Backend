// import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_KEY,
//   },
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.log("SMTP ERROR:", error);
//   } else {
//     console.log("SMTP is ready to send emails");
//   }
// });

// export const sendemail = async ({ email, subject, text }) => {
//   try {
//     const info = await transporter.sendMail({
//       // 
//       from: `"Auth Project" <${process.env.SENDER_EMAIL}>`,
//       to: email,
//       subject,
//       html: `<h2>Your OTP is: ${text}</h2>`,
//     });

//     console.log("Mail sent:", info.response);
//     return info;

//   } catch (error) {
//     console.error("Mail error FULL:", error);
//     throw error;
//   }
// };















import nodemailer from 'nodemailer'
export const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_KEY,
    }
});

export const sendemail = async({email,subject,text})=>{
    try{
        let info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to:email,
            subject:subject,
            text:text
        })
        console.log("Mail sent",info.messageId);
        
    }catch(error){
        console.error(error);
        throw new Error(error);
    }
}

