const User = require("../Model/userModel");
const Camp = require("../Model/campModel");
const Admin = require("../Model/adminModel");
const Request = require("../Model/requestModel");
const Inventory = require("../Model/inventryModel");
const Data = require("../Model/dataModel");
const { campMail, requestDonorMail } = require("../helpers/nodemailer");
const otp = require("../helpers/otp");

let errMsg;
let msg;
let district;
let camp;
let users;
let dataCamp;
let userData;
let Invent;
let search;
let status;



const login = async (req, res) => {
  try {

    res.render("adminlogin", { errMsg });

    errMsg = "";
  } catch (error) {
    console.log(error.message);
  }
};
const loginCheck = async (req, res) => {
  const adminData = await Admin.findOne({ email: req.body.email });
  try {
    if (!adminData) {
      errMsg = "Account not found";
      res.redirect("/admin/login");
    } else if (adminData.email == req.body.email) {
      if (adminData.password == req.body.password) {
        req.session.admin = true;
        req.session.ObId = adminData.id;
        req.session.Aemail = adminData.email;
        res.redirect("/admin/adminHome");
      } else {
        //password wrong
        errMsg = "Email or Password is wrong";
        res.redirect("/admin/login");
      }
    } else {
      // email not exist
      errMsg = "Email or Password is wrong";
      res.redirect("/admin/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

const adminHome = async (req, res) => {
  try {
    const C_Tot = await User.countDocuments({});
    const bloodUser = {
      a_p: await User.countDocuments({ bloodGroup: "A+" }),
      a_n: await User.countDocuments({ bloodGroup: "A-" }),
      b_p: await User.countDocuments({ bloodGroup: "B+" }),
      b_n: await User.countDocuments({ bloodGroup: "B-" }),
      ab_p: await User.countDocuments({ bloodGroup: "AB+" }),
      ab_n: await User.countDocuments({ bloodGroup: "AB-" }),
      o_p: await User.countDocuments({ bloodGroup: "O+" }),
      o_n: await User.countDocuments({ bloodGroup: "O-" }),
    };
    const data = await User.aggregate([
      { $group: { _id: "$bloodGroup", count: { $sum: 1 } } },
    ]);
    const labels = JSON.stringify(data.map((item) => item._id));
    const values = JSON.stringify(data.map((item) => item.count));

    //District

    const dis = await User.aggregate([
      { $group: { _id: "$district", count: { $sum: 1 } } },
    ]);

    const label = JSON.stringify(dis.map((item) => item._id));
    const value = JSON.stringify(dis.map((item) => item.count));

    //New dashboard details

    const active = await User.find({});
    const activeDonor = active.length;

    const date = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format

    const count = await Admin.aggregate([
      {
        $match: {
          email: req.session.Aemail,
          "appointment.date": date,
          "appointment.status": "OK",
        },
      },
      {
        $project: {
          count: {
            $size: {
              $filter: {
                input: "$appointment",
                as: "item",
                cond: {
                  $and: [
                    { $eq: ["$$item.date", date] },
                    { $eq: ["$$item.status", "OK"] },
                  ],
                },
              },
            },
          },
        },
      },
    ]);
    let TCount = 0;
    if (count[0]) {
      TCount = count[0].count;
    }

    const Wcount = await Admin.aggregate([
      {
        $match: {
          email: req.session.Aemail,
          "appointment.status": "Pending",
        },
      },
      {
        $project: {
          count: {
            $size: {
              $filter: {
                input: "$appointment",
                as: "item",
                cond: {
                  $and: [{ $eq: ["$$item.status", "Pending"] }],
                },
              },
            },
          },
        },
      },
    ]);

    let WTCount = 0;
    if (Wcount[0]) {
      WTCount = Wcount[0].count;
    }

    const inventory = await Inventory.findOne({
      hospitalId: req.session.Aemail,
    });

    let totalCount = 0;
    if (inventory) {
      Object.keys(inventory.bloodInventory).forEach((bloodType) => {
        totalCount += inventory.bloodInventory[bloodType].length;
      });

    }
    //Inventry Count
    const inventorys = await Inventory.findOne({
      hospitalId: req.session.Aemail,
    });

    let bloodInventoryCounts = {};
    if (inventory) {
      Object.keys(inventorys.bloodInventory).forEach((bloodType) => {
        bloodInventoryCounts[bloodType] =
          inventorys.bloodInventory[bloodType].length;
      });
    }

    //top Donors

    const topUsers = await User.find().sort({ donatedTimes: -1 }).limit(3);

    //camp details
    let AllCamp = await Camp.find({});

    console.log(topUsers);
    // res.render("dashboard", { bloodGroups: bloodUser, labels, values, label, value, data, C_Tot });

    //live date
    const statsCount = await Data.findOne({ email: req.session.Aemail })
    const countStats = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => {
      countStats[month] = statsCount[month].count;
    });


    console.log('Printing')
    const over = await Data.findOne({ email: 'admin1@gmail.com' })
    console.log(over.BloodStats)
    const overall = {};
    const blood = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

    blood.forEach(blood => {
      overall[blood] = over.BloodStats[blood]
    });
    console.log(overall)




    res.render("dashboard", { AllCamp, topUsers, activeDonor, TCount, totalCount, WTCount, bloodInventoryCounts: JSON.stringify(bloodInventoryCounts), countStats: JSON.stringify(countStats), overall: JSON.stringify(overall), bloodGroups: bloodUser, labels, values, bloodGroups: bloodUser });

  } catch (error) {
    console.log(error.message);
  }
};

const adminDonor = async (req, res) => {
  try {
    if (userData == "") {
      userData = await User.find({});
    }
    res.render("admindonor", { userData, msg });
    userData = "";
    msg = "";
  } catch (error) {
    console.log(error.message);
  }
};
const showDonor = async (req, res) => {
  try {
    const { district, bloodGroup, phno } = req.body;
    console.log(req.body);
    const filter = {};
    if (district) {
      filter.district = district.toUpperCase();
    }
    if (bloodGroup) {
      filter.bloodGroup = bloodGroup.toUpperCase();
    }
    if (phno) {
      filter.phno = phno;
    }
    const users = await User.find(filter);
    userData = users.map((user) => ({
      name: user.name,
      district: user.district,
      phno: user.phno,
      bloodGroup: user.bloodGroup,
      age: user.age,
      email: user.email,
      status: user.status,
      id: user.id,
    }));
    res.redirect("adminDonor");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const userStatusManage = async (req, res) => {
  try {
    let uId = req.query.id;
    let isBlocked = await User.findById(uId);
    if (isBlocked.status) {
      await User.updateOne({ email: isBlocked.email }, { status: false });
      console.log(isBlocked);
      msg = "Blocked " + isBlocked.name;
    } else {
      await User.updateOne({ email: isBlocked.email }, { status: true });
      msg = "Unblocked " + isBlocked.name;
    }
    res.redirect("/admin/adminDonor");
  } catch (error) {
    console.log(error);
  }
};

const adminCamp = async (req, res) => {
  try {
    let exCamp = await Camp.find({});
    if (district && dataCamp) {
      const users = await User.find({ district: district });
      await Promise.all(
        users.map(async (user) => {
          await campMail(
            user.name,
            user.email,
            dataCamp.place,
            dataCamp.district,
            dataCamp.date,
            dataCamp.phno
          );
        })
      );

      console.log(users);
      district = "";
      dataCamp = "";
      res.render("admincamp", { users, exCamp, status });
      status = ""
    } else {
      res.render("admincamp", { users, exCamp, status });
      status = ""
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Error processing request");
  }
};

const adminNewCamp = async (req, res) => {
  try {
    dataCamp = {
      district: req.body.district,
      phno: req.body.phno,
      place: req.body.place,
      date: req.body.date,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      campId: otp(),
    };
    console.log(dataCamp);
    if (dataCamp) {
      await Camp.insertMany([dataCamp]);
      console.log(`Success New Camp ${dataCamp}`);
      status = 1
    }
    district = req.body.district;
    //sending mail
    res.redirect("/admin/adminCamp");
  } catch (error) {
    console.log(error.message);
  }
};

const adminCampDetail = async (req, res) => {
  try {
    let camps = await Camp.find({});
    let campDetails = camps.map((camp) => {
      let morningCount = camp.response.Morning.length;
      let afternoonCount = camp.response.Afternoon.length;
      let eveningCount = camp.response.Evening.length;
      let place = camp.place;
      let date = camp.date;
      let district = camp.district;
      let phno = camp.phno;
      return {
        _id: camp._id,
        morningCount: morningCount,
        afternoonCount: afternoonCount,
        eveningCount: eveningCount,
        place: place,
        date: date,
        district: district,
        phno: phno,
      };
    });
    res.render("admincampdetail", { camp: campDetails });
  } catch { }
};

const adminRequest = async (req, res) => {
  try {
    res.render("adminrequest");
  } catch { }
};

const adminDonorRequest = async (req, res) => {
  try {
    const data = {
      H_name: req.body.H_name,
      H_address: req.body.H_address,
      H_district: req.body.H_district,
      P_id: req.body.P_id,
      phno: req.body.phno,
      date_need: req.body.date_need,
      blood_group: req.body.blood_group,
    };
    // const result = await Request.insertMany([data]);
    const result = await Request.create(data);
    let temp = req.body.H_district.toUpperCase();
    const reqMail = await User.find({ district: temp });

    await Promise.all(
      reqMail.map(async (user) => {
        await requestDonorMail(user.email, data);
      })
    )
      .then(() => {
        msg = "New Request Added";
        res.redirect("adminRequestManage");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const adminRequestManage = async (req, res) => {
  try {
    let donor = await Request.find({});
    const id = req.query.hero;
    let detailsOfHero = await User.findOne({ _id: id });
    res.render("adminRequestManage", { msg, donor, detailsOfHero });
    msg = "";
  } catch (error) {
    console.log(error.message);
  }
};

const detailsOfHero = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Request.findOne({ _id: id }, { response_id: 1 });
    const hero = await User.findOne({ _id: data.response_id });
    return res.redirect(`/admin/adminRequestManage?hero=${hero.id}`);
  } catch (error) {
    console.log(error);
    return res.send("Erro no banco de dados!");
  }
};
const appointPage = async (req, res) => {
  try {
    let appointments = await Admin.find({ _id: req.session.ObId });
    res.render("adminAppointment", { appointments });
  } catch (error) {
    console.log(error.message);
  }
};
const appointOk = async (req, res) => {
  try {
    console.log("hai vro form ");
    const id = req.params.id;

    const updatedAdmin = await Admin.findOneAndUpdate(
      { email: req.session.Aemail, "appointment.id": id },
      { $set: { "appointment.$.status": "OK" } },
      { new: true }
    );
    const inven = await User.findOne({ _id: id });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 42);

    const inventData = {
      id: inven.id,
      status: 0,
      expiryDate: expiryDate,
    };
    console.log(inven);
    const update = await Inventory.updateOne(
      { hospitalId: req.session.Aemail },
      { $push: { [`bloodInventory.${inven.bloodGroup}`]: inventData } },
      { new: true }
    );

    console.log(update);

    res.redirect("/admin/appointment");
  } catch (error) {
    console.log(error);
  }
};

const deleteRequest = async (req, res) => {
  try {
    const delId = req.params.id;
    if (delId) {
      await Request.deleteOne({ _id: delId });
      msg = "Request Deleted";
    }
    res.redirect("/admin/adminRequestManage");
  } catch (error) {
    console.log(error);
  }
};

const inventoryPage = async (req, res) => {
  try {
    const bloodGroupCounts = await Inventory.aggregate([
      {
        $match: { hospitalId: req.session.Aemail },
      },
      {
        $project: {
          bloodInventory: { $objectToArray: "$bloodInventory" },
        },
      },
      {
        $unwind: "$bloodInventory",
      },
      {
        $project: {
          bloodGroup: "$bloodInventory.k",
          count: { $size: "$bloodInventory.v" },
        },
      },
      {
        $unset: "_id",
      },
    ]);
    const chartData = {
      labels: bloodGroupCounts.map((item) => item.bloodGroup),
      datasets: [
        {
          label: "Blood Group Counts",
          data: bloodGroupCounts.map((item) => item.count),
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };

    // console.log(bloodGroupCounts);
    // console.log(search);
    res.render("adminInventory", {
      chartData: JSON.stringify(chartData),msg,
      Invent,
      search,
    });
    Invent = "";
    msg=" "
  } catch (error) {
    console.log(error);
  }
};

const showInven = async (req, res) => {
  try {
    search = req.body.search;
    let Invents = await Inventory.find({ hospitalId: req.session.Aemail, [`bloodInventory.${search}.status`]: "0" });

    if (Invents && Invents.length > 0) {
      Invents.forEach((doc) => {
        Invent = doc.bloodInventory[search];

      });
    } else {
      console.log("No inventory found for hospitalId: admin1@gmail.com");
    }
    res.redirect("/admin/inventory");
  } catch (error) {
    console.log(error);
  }
};
const book = async (req, res) => {
  try {
    const id = req.query.id;
    let updated = await Inventory.findOneAndUpdate(
      { hospitalId: req.session.Aemail, [`bloodInventory.${search}.id`]: id },
      { $set: { [`bloodInventory.${search}.$.status`]: "1" } },
      { new: true }
    );
    mg=1
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentDate = new Date();
    const currentMonth = months[currentDate.getMonth()];
    let datum = await Data.updateOne(
      { email: req.session.Aemail },
      { $inc: { [`${currentMonth}.count`]: 1 } }
    );
    console.log("Result")
    console.log(currentMonth)
    console.log(datum)
    res.redirect('/admin/inventory')
  }
  catch (error) {
    console.log(error)
  }
}

module.exports = {
  login,
  loginCheck,
  adminHome,
  adminDonor,
  showDonor,
  adminCamp,
  adminNewCamp,
  adminCampDetail,
  adminRequest,
  adminDonorRequest,
  adminRequestManage,
  detailsOfHero,
  userStatusManage,
  appointPage,
  appointOk,
  deleteRequest,
  inventoryPage,
  showInven,
  book
};
