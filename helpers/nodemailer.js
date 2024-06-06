const nodemailer = require('nodemailer')
const sendMail = async (name, content,email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: " ",
        pass: "",
      }
    })
        const mailOptions = {
            from: '',
            to: email,
            subject: content,
            html: '<p>Hi ' + name + ',This is from BloodShare Hub.<br> It is your OTP : ' + otp + '</p>'
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email has been send ', info.response);
            }
        })
    } catch (error) {
        console.log(error);
    }
}
const campMail = async (name, email, place, district, date,phno) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: " ",
                pass: " ",
            }
        })
        const mailOptions = {
            from: ' ',
            to: email,
            subject: 'Blood Donation Camp at ' + district + ' on ' + date,
            html: `<p>Hi ${name},</p>
                   <p>This is a reminder for the Blood Donation Camp at ${place} on ${date}. Your participation can save lives and make a difference.</p>
                   <p>Join us and be a hero!</p>
                   <p>Login Website for further details</p>
                   <p>Contact : ${phno}</p>
                   <p>Best regards,<br>BloodShare Hub</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email has been sent: ', info.response);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const requestDonorMail = async (to,data) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: " ",
            pass: " ",
        },
      });
    let mailOptions = {
        from: " ",
        to: to,
        subject: "Emergency Alert",
        html: `<p>Dear Donor,</p>
        <p>There is an urgent need for blood at ${data.H_Name} located at ${data.H_address}, ${data.H_district}. Patient ID: ${data.P_id} requires blood on ${data.date}.</p>
        <p>Your willingness to donate blood can save a life. Please contact ${data.phno} for more information and to schedule a donation appointment.</p>
        <p>Thank you for your kindness and willingness to help those in need.</p>
        <p>Best regards,<br>Blood Share HUB Team</p>`
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent to :" ,info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};



module.exports = 
{
    sendMail,
    campMail,
    requestDonorMail
}
