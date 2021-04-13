
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Publisher = require("../models/Publisher");


const loginPage = (req, res)=>{
    return res.render("./blog/login", {publisherAuth: req.publisher});
}
const login = (req, res)=>{
    Publisher.findOne({email: req.body.email}, (err, publisher)=>{
        if (err){
            console.log(err);
            return res.send("Error while retrieving data");
        }
        if (!publisher){
            return res.send("User or password incorrect");
        }
        let validation = bcrypt.compareSync(req.body.password, publisher.password);
        if (!validation){
            return res.send("User or password incorrect");
        }
        
        let token = jwt.sign({_id: publisher._id}, process.env.TOKEN_SECRET);
        res.cookie("authorization-token", token);        
        return res.redirect("/blog/editor/publishers");
    })
}
const logout = (req, res)=>{
    res.clearCookie("authorization-token");
    return res.redirect("/blog/editor/login");
}



module.exports = {
    
    loginPage,
    login,
    logout,
   
}