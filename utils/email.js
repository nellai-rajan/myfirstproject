const nodemailer = require('nodemailer');
require('dotenv').config()

USER_MAIL= process.env.USER_MAIL||"your@gmail.com"
PASSWORD= process.env.APP_PASSWORD||"google account app password"
async function sendEmail(from,to,subject,text) {
  try{

    // 1. Create a transporter
    let transporter = nodemailer.createTransport({
      service:'gmail',
      // host: 'smtp.gmail.com',
      port: 587, // TLS port  is mostly use           // port: 465,       // SSL port   BUT TLS AND SSL IS SECURE
      secure: false,                                  // secure: true
      auth: {
        user: USER_MAIL,      // Your email
        pass: PASSWORD,         // App password from Gmail
        
      },
    });
  
    // 2. Send the email
    let info = await transporter.sendMail({
      from: from, // Sender name & address
      to: to,              // Receiver email
      subject: subject,
      text: text,
      html: '<b>This is an HTML email</b>'
    });
  
    console.log('Message sent: %s', info.messageId);
  
    return info
  }catch(err){
    console.log("err===>",err)
    return err
  }
}



module.exports={sendEmail}


