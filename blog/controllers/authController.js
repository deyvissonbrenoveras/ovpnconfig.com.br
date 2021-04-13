const jwt = require("jsonwebtoken");

module.exports = (req, res, next)=>{
    let loginUrl = "/blog/editor/login";
    if (req.originalUrl == loginUrl){
        next();
    }
    else{
        try {
            let token = req.cookies["authorization-token"];
            const publisherVerified = jwt.verify(token, process.env.TOKEN_SECRET);
            req.publisher = publisherVerified;
            next();
        } catch (error) {
            return res.redirect(loginUrl);
        }
    }
   
}