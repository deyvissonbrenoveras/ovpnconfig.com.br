const jwt = require("jsonwebtoken");
const User = require("../models/User");

const checkUser = (req, res, next) => {
  try {
    let token = req.cookies["user-authorization-token"];
    if (token) {
      const userVerified = jwt.verify(token, process.env.TOKEN_SECRET);
      if (userVerified) {
        User.findById(userVerified._id, (err, user) => {
          if (err) console.log(err);
          if (user) {
            req.user = user;
          }
          next();
        })
          .select("email")
          .select("vencimentoPremium")
          .select("vencimentoTrial");
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
const forceAuth = (req, res, next) => {
  try {
    let token = req.cookies["user-authorization-token"];
    if (token) {
      const userVerified = jwt.verify(token, process.env.TOKEN_SECRET);
      if (userVerified) {
        User.findById(userVerified._id, (err, user) => {
          if (err) console.log(err);
          if (user) {
            req.user = user;
          }
          next();
        })
          .select("email")
          .select("vencimentoPremium");
      } else {
        return res.redirect("/user/login");
      }
    } else {
      return res.redirect("/user/login");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
module.exports = {
  checkUser,
  forceAuth,
};
