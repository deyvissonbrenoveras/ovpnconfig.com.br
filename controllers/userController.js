const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer = require("nodemailer");

const TRIAL_DAYS = Number(process.env.TRIAL_DAYS);

const createAccountPage = (req, res) => {
  return res.render("createAccount", { user: req.user, emailExists: false });
};
const createAccount = (req, res) => {
  const newUser = req.body;
  newUser.password = bcrypt.hashSync(newUser.password);

  let vencimentoTrial = new Date(Date.now());
  vencimentoTrial.setDate(vencimentoTrial.getDate() + TRIAL_DAYS);
  newUser.vencimentoTrial = vencimentoTrial;

  User.findOne({ email: newUser.email }, (err, user) => {
    if (err) console.log(err);
    if (user) {
      return res.render("createAccount", { user: req.user, emailExists: true });
    } else {
      User.create(newUser, (err, userCreated) => {
        if (err) {
          console.log(err);
          return res.send("Error while creating user");
        }
        let token = jwt.sign(
          { _id: userCreated._id },
          process.env.TOKEN_SECRET
        );
        res.cookie("user-authorization-token", token);
        return res.redirect("/");
      });
    }
  });
};
const loginPage = (req, res) => {
  return res.render("loginPage", { loginError: false, user: req.user });
};
const login = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log(err);
      return res.render("loginPage", { loginError: true, user: req.user });
    }
    if (!user) {
      return res.render("loginPage", { loginError: true, user: req.user });
    }
    let validation = bcrypt.compareSync(req.body.password, user.password);
    if (!validation) {
      return res.send("User or password incorrect");
    }
    let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.cookie("user-authorization-token", token);
    return res.redirect("/");
  });
};
const logout = (req, res) => {
  res.clearCookie("user-authorization-token");
  return res.redirect("/");
};
const resetPasswordPage = (req, res) => {
  return res.render("resetPassword", { user: req.user, emailSent: false });
};
const resetPassword = (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) console.log(err);
    if (!user) {
      return res.render("resetPassword", { user: req.user, emailSent: true });
    } else {
      var fullUrl =
        (req.get("host").includes("localhost:3000") ? "http" : "https") +
        "://" +
        req.get("host") +
        req.originalUrl;
      let token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        expiresIn: 30 * 30,
      });
      const transporter = nodemailer.createTransport({
        host: "smtp.umbler.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      transporter
        .sendMail({
          from: process.env.EMAIL_USER,
          to: req.body.email,
          replyTo: process.env.EMAIL_USER,
          subject: "Password reset - Mikrotik OpenVPN Config Generator",
          text: `To reset your password, please click on the link below \r\n ${fullUrl}/${token}`,
        })
        .then((info) => {
          return res.render("resetPassword", {
            user: req.user,
            emailSent: true,
          });
        })
        .catch((error) => {
          console.log(error);
          return res.render("resetPassword", {
            user: req.user,
            emailSent: false,
          });
        });
    }
  });
};
const resetPasswordLastStagePage = (req, res) => {
  try {
    if (jwt.verify(req.params.token, process.env.TOKEN_SECRET)) {
      return res.render("resetPasswordLastStage", {
        user: req.user,
        expired: false,
        reseted: false,
        token: req.params.token,
      });
    } else {
      return res.render("resetPasswordLastStage", {
        user: req.user,
        reseted: false,
        expired: true,
      });
    }
  } catch (err) {
    return res.render("resetPasswordLastStage", {
      user: req.user,
      reseted: false,
      expired: true,
    });
  }
};
const resetPasswordLastStage = (req, res) => {
  try {
    let userVerified = jwt.verify(req.params.token, process.env.TOKEN_SECRET);
    if (userVerified) {
      User.findByIdAndUpdate(
        userVerified,
        { password: bcrypt.hashSync(req.body.password) },
        { useFindAndModify: false },
        (err, user) => {
          if (err) {
            console.log(err);
          }
          return res.render("resetPasswordLastStage", {
            user: req.user,
            reseted: true,
            expired: false,
          });
        }
      );
    } else {
      return res.render("resetPasswordLastStage", {
        user: req.user,
        reseted: false,
        expired: true,
      });
    }
  } catch (err) {
    return res.render("resetPasswordLastStage", {
      user: req.user,
      reseted: false,
      expired: true,
    });
  }
};
module.exports = {
  createAccountPage,
  createAccount,
  login,
  loginPage,
  logout,
  resetPasswordPage,
  resetPassword,
  resetPasswordLastStagePage,
  resetPasswordLastStage,
};
