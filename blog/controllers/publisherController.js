const Publisher = require("../models/Publisher");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");


const newPublisherPage = (req, res)=>{    
    return res.render("./blog/newPublisher", {publisherAuth: req.publisher});
}
const publishersPage = (req, res)=>{
    Publisher.find({}, (err, publishers)=>{
        if (err){
            console.log(err);
            return res.send("Error while retrieving data");
        }        
        return res.render("./blog/publishers", {publishers, publisherAuth: req.publisher});
    })
}
const editPublisherPage = (req, res)=>{
     Publisher.findOne({_id: req.params.publisherId}, (err, publisher)=>{
        return res.render("./blog/editPublisher", {publisher, publisherAuth: req.publisher});
     })
    
}
const newPublisher = (req, res)=>{
    let imageExtension = req.files.image.name.split(".").pop();
    let imagePath = `${req.body.name}-${Date.now()}.${imageExtension}`;
    req.body.image = imagePath;
    req.body.password = bcrypt.hashSync(req.body.password);
    req.files.image.mv(path.join(__dirname, `../images/publishers/${imagePath}`), function(err){
        Publisher.create(req.body, (error)=>{
            if (error){
                console.log(error);
                return res.send("Error while creating post");                 
            }
            return res.redirect("/blog/editor/publishers");
        });
    });
}
const publisherValidation = (req, res, next)=>{
    let publisher = req.body;
    if (!req.files && req.url.includes("newpublisher")){
        return res.send("Please, insert image");
    }
    else if(publisher.name.length < 4){
        return res.send("Please, insert name bigger than 3 characteres");
    }
    else if (!publisher.email.includes("@") || !publisher.email.includes(".")){
        return res.send("Please, insert a valid e-mail"); 
    }
    else if (publisher.password != publisher.confirmPassword){
        return res.send("Passwords don't match");
    }
    else if (publisher.password.length < 8){
        return res.send("Please, insert password bigger than 8 characteres"); 
    }
    else{
        Publisher.findOne({email: publisher.email}, (err, publisherFound)=>{
            if (err){
                console.log(error);
                return res.send("Error while editing or creating publisher");
            }
            else if (publisherFound && publisher._id != publisherFound._id){
                return res.send("A post publisher with this e-mail was already created");
            }
            else {
                next();
            }
        });
    }
}
const editPublisher = (req, res)=>{
    if (req.files){
        let imageExtension = req.files.image.name.split(".").pop();
        let imagePath = `${req.body.name}-${Date.now()}.${imageExtension}`;
        let tempPath = path.join(__dirname,`../images/temp/${imagePath}`);
        let publishersPath = path.join(__dirname,`../images/publishers/${imagePath}`);
        req.body.image = imagePath;

        req.files.image.mv(tempPath, (err)=>{
            if (err){
                console.log(err);
                return res.send("Error while updating publisher");   
            }
            sharp(tempPath).resize({width: 600}).toFile(publishersPath, error=>{
                if (error)
                    console.log(error);
            });
        });
    }
    Publisher.findByIdAndUpdate(req.body._id, req.body, {useFindAndModify: false}, (err, publisher)=>{
        if (err){
            console.log(err)
            return res.send("Error while editing publisher");
        }
        else if (!publisher){
            return res.send("Publisher not found");  
        }        
        return res.redirect("back");
    });
}

module.exports = {
    newPublisherPage,
    publishersPage,
    editPublisherPage,
    editPublisher,   
    newPublisher,
    publisherValidation
}