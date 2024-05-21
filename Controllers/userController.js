const User = require("../Model/userModel");
const Camp = require("../Model/campModel");
const Request = require("../Model/requestModel");
const Admin = require("../Model/adminModel");
const Appoint = require("../Model/appointmentModel");
const session = require("express-session");
const otpGenerator = require("../helpers/otp");
const { sendMail } = require("../helpers/nodemailer");
const { request } = require("../routes/adminRoute");
const { redirect } = require("express/lib/response");
const { HostAddress } = require("mongodb");
// const upload = require('../helpers/multer');

//Global Variables
let errMsg;
let otpVal;
let otpEmail;
let content;
let show;
let msg;
let data;
let district;
let C_dis;
let C_Tot;
let help;
let photo;
let status;

const login = async (req, res) => {
  try {
    otpVal = "";
    req.session.User = false;
    res.render("login", { errMsg });
    errMsg = "";
  } catch (error) {
    console.log(error.message);
  }
};

const loginCheck = async (req, res) => {
  otpVal = "";
  loginData = await User.findOne({ name: req.body.name });
  try {
    if (!loginData) {
      res.redirect("/");
      errMsg = "User Not Found";
      //Email not found
    }
    if (loginData.status) {
      if (loginData) {
        if (loginData.password === req.body.password) {
          req.session.User = true;
          req.session.email = loginData.email;
          req.session.obId = loginData._id;
          req.session.district = loginData.district;
          req.session.blood = loginData.bloodGroup;
          req.session.photo = loginData.image;
          status = 1;
          // const dateString = loginData.last_donate;
          // const date = new Date(dateString);
          // const currentDate = new Date();
          // const diffInDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
          // console.log(diffInDays);
          res.redirect("/home");
        } else {
          //Password wrong
          res.redirect("/");
          errMsg = "Wrong Password ";
        }
      }
    } else {
      res.redirect("/");
      errMsg = "You have been temporarily blocked by the admin";
    }
  } catch (error) {
    console.log(error);
  }
};

const home = async (req, res) => {
  try {
    if (req.session.User) {
      console.log("rendering homepage");
      C_dis = await User.countDocuments({ district: req.session.district });
      C_Tot = await User.countDocuments({});
      help = await Request.countDocuments({ blood_group: req.session.blood });
      res.render("home", { C_dis, C_Tot, help, status });
      status = " ";
    } else {
      console.log("error");
    }
  } catch {
    console.error(err);
  }
};

const signup = async (req, res) => {
  try {
    res.render("signup");
  } catch {
    console.error(err);
  }
};
const newUser = async (req, res) => {
  try {
    console.log("enetred");
    const data = {
      name: req.body.name,
      email: req.body.email,
      phno: req.body.phno,
      password: req.body.password,
      bloodGroup: req.body.bloodGroup,
    };
    const exist = await User.findOne({ email: data.email });
    if (exist) {
      console.log("yes");
      res.render("signup", { already: 1 });
    } else {
      console.log("no");
      if (data) {
        await User.insertMany([data]);
        res.redirect("/");
      }
    }
  } catch (error) {
    console.error(error.message);
  }
};

const forget = async (req, res) => {
  try {
    res.render("forgot", { otpVal, otpEmail, show, msg });
    msg = "";
    otpEmail = "";
    show = "";
  } catch {
    console.error(err);
  }
};

const generateOpt = async (req, res) => {
  try {
    data = await User.findOne({ email: req.body.email });
    if (data) {
      otpVal = otpGenerator();
      content = "OTP FROM BLOODSHARE_HUB";
      sendMail(data.name, content, data.email, otpVal);
      otpEmail = data.email;
      res.redirect("/forgotpage");
    } else {
      msg = "user not found";
      res.redirect("/forgotpage");
    }
  } catch {
    console.error(err);
  }
};
const otpVerify = async (req, res) => {
  try {
    if (otpVal == req.body.code) {
      otpVal = "";
      show = 1;
      res.redirect("/forgotpage");
    } else {
      msg = "Wrong OTP";
      res.redirect("/forgotpage");
    }
  } catch {
    console.error(err);
  }
};
const changePass = async (req, res) => {
  try {
    await User.updateOne(
      { email: data.email },
      { $set: { password: req.body.newPass } }
    );
    req.session.email = data.email;
    status = 1;
    res.redirect("/home");
  } catch (error) {
    console.error(error);
  }
};
const profilePage = async (req, res) => {
  try {
    let details = await User.findOne({ email: req.session.email });
    res.render("profile", { C_dis, C_Tot,msg, details, photo: req.session.photo });
    msg = "";
  } catch {
    console.error(err);
  }
};
const profileUpdate = async (req, res) => {
  const date = req.body.edit_date ? new Date(req.body.edit_date) : null;
  let formattedDate = null;
  if (date) {
    const options = { day: "numeric", year: "numeric", month: "numeric" };
    formattedDate = date.toLocaleDateString("en-US", options);
  }
  let images = req.files.map((file) => {
    return file.filename;
  });

  const datas = {
    name: req.body.name,
    phno: req.body.phno,
    age: req.body.age,
    email: req.body.email,
    district: req.body.district,
    weight: req.body.weight,
    image: images[0],
  };

  if (formattedDate) {
    datas.last_donate = formattedDate;
  }

  try {
    const result = await User.updateOne(
      { email: req.session.email },
      { $set: datas }
    );
    if (result.modifiedCount == 1) {
      msg = "Profile Updated";
    } else {
      msg = "Error Occurred..!";
    }
    res.redirect("/profile");
  } catch (err) {
    console.error(err);
  }
};

const campPage = async (req, res) => {
  try {
    let camp = await Camp.find({
      district: req.session.district,
      $nor: [
        { "response.Morning": req.session.obId },
        { "response.Afternoon": req.session.obId },
        { "response.Evening": req.session.obId },
      ],
    });

    res.render("camp", { C_dis, C_Tot,camp, msg });
    msg = "";
  } catch (error) {
    console.log(error.message);
  }
};
const campin = async (req, res) => {
  try {
    const id = req.params.id;
    const responseId = req.session.obId;
    const period = req.body.period;
    let result = 0;
    if (period == "Morning") {
      result = await Camp.updateOne(
        { _id: id },
        { $push: { "response.Morning": responseId } }
      );
    } else if (period == "Evening") {
      result = await Camp.updateOne(
        { _id: id },
        { $push: { "response.Evening": responseId } }
      );
    } else if (period == "Afternoon") {
      result = await Camp.updateOne(
        { _id: id },
        { $push: { "response.Afternoon": responseId } }
      );
    }
    if (result.modifiedCount) {
      msg = "Your Slot Confirmed";
      res.redirect("/camp");
    }
  } catch (error) {
    console.log(error.message);
  }
};
const respondPage = async (req, res) => {
  try {
    let request = await Request.find({
      response_id: "",
      blood_group: req.session.blood,
    });
    
    res.render("response", {C_dis, C_Tot, request, msg });
    msg = "";
  } catch (error) {
    console.log(error.message);
  }
};
const respond = async (req, res) => {
  try {
    const resId = req.params._id;
    console.log(req.session.obId);
    const request = await Request.updateOne(
      { _id: resId },
      { $set: { response_id: req.session.obId } }
    );
    if (request.modifiedCount) {
      msg = 1;
      res.redirect("/response");
    }
  } catch (error) {
    console.log(error);
  }
};

const appointPage = async (req, res) => {
  try {
    let HosDetail = await Admin.find({});
    let lastD = await User.findById({ _id: req.session.obId });
    const appoint2 = await Admin.findOne(
      { "appointment.id": req.session.obId },
      { "appointment.$": 1 }
    );
    const hos = await Admin.findOne({ "appointment.id": req.session.obId });
    let appoint;
    if (appoint2) {
      appoint = appoint2.appointment[0];
    }
    
    res.render("appointment", {C_dis, C_Tot,
      HosDetail,
      lastD,
      msg,
      appoint,
      hos,
      photo: req.session.photo,
    });
    msg = "";
  } catch (error) {
    console.log(error);
  }
};
const appointBook = async (req, res) => {
  try {
    const apointBook = {
      id: req.session.obId,
      date: req.body.date,
      name: req.body.name,
      bloodGroup: req.body.bloodGroup,
    };
    let resultAppont = await Admin.findOneAndUpdate(
      { H_name: req.body.H_name },
      { $push: { appointment: apointBook } }
    );
    msg = "Appointment sent. Please wait for confirmation";
    msg = 1;
    res.redirect("/appointment");
  } catch (error) {
    console.log(error);
  }
};

const myAppointPage = async (req, res) => {
  try {
    res.render("myAppointment", { C_dis, C_Tot,C_dis, C_Tot, });
  } catch (error) {
    console.log(error);
  }
};
const statusPage = async (req, res) => {
  try {
    res.render("status");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  login,
  loginCheck,
  home,
  signup,
  newUser,
  home,
  forget,
  generateOpt,
  otpVerify,
  changePass,
  profilePage,
  profileUpdate,
  campPage,
  campin,
  respondPage,
  respond,
  appointPage,
  appointBook,
  myAppointPage,
  statusPage,
};
