const Post = require("../models/Post");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const newPostPage = (req, res)=>{
    return res.render("./blog/newPost", {publisherAuth: req.publisher});
}
const postsPage = (req, res)=>{
    Post.find({}, (err, posts)=>{
        if (err){
            console.log(err);
            return res.send("Error while retrieving data");
        }
        else {
            return res.render("./blog/posts", {publisherAuth: req.publisher, posts});
        }
    });
     
}
const editPostPage = (req, res)=>{
    Post.findById(req.params.postId, (err, post)=>{
        if (err){
            console.log(err)
        }
        if(!post){
            return res.send("Post not found");
        }
        else{
            return res.render("./blog/editPost", {post, publisherAuth: req.publisher});
        }
    });
}
const newPost = (req, res)=>{
    let post = req.body;   
    if (post.published)
        post.published = true;
    else
        post.published = false;
   
    //Create post
    let imageExtension = req.files.headingImage.name.split(".").pop();
    let imagePath = `${post.url}.${imageExtension}`;
    let tempPath = path.join(__dirname,`../images/temp/${imagePath}`);
    let postsPath = path.join(__dirname,`../images/posts/${imagePath}`);
    post.publisher = req.publisher._id;
    //Saveimage
    req.files.headingImage.mv(tempPath, function(err){
        if (err){
            console.log(err);
            return res.send("Error while creating post");   
        }
        //Sharp
        sharp(tempPath).resize({width: 1200, height: 625}).toFile(postsPath, error=>{
            if (error)
                console.log(error);
            fs.unlink(tempPath, error=>{
                if (error){
                    console.log(error)
                }
            });
            //Save the post    
            post.headingImage = imagePath;
            Post.create(req.body, (error, postCreated)=>{
                if (error){
                    console.log(error);
                    return res.send("Error while creating post");   
                }
                return res.redirect("/blog/editor/editpost/" + postCreated._id)
            });        
        });          
    });
    
}
const editPost = (req, res)=>{
    req.body.lastUpdate = Date.now();
    if (req.body.published)
        req.body.published = true;
    else
        req.body.published = false;       
    Post.findOne({_id: req.body._id}, (err, post)=>{
        if (err){
            console.log(err);
        }
        if (!post)
            return res.send("Post not found");  
        //Update images              
        if (req.files){
            fs.unlink(path.join(__dirname, `../images/posts/${post.headingImage}`), (err)=>{
                if (err)
                    console.log(err)
                let imageExtension = req.files.headingImage.name.split(".").pop();
                let imagePath = `${req.body.url}.${imageExtension}`;
                let tempPath = path.join(__dirname,`../images/temp/${imagePath}`);
                let postsPath = path.join(__dirname,`../images/posts/${imagePath}`);
                req.body.headingImage = imagePath;
                req.files.headingImage.mv(postsPath, (err)=>{
                    if (err){
                        console.log(err);
                        return res.send("Error while updating post");   
                    }
                    // sharp(tempPath).resize({width: 1200, height: 625}).toFile(postsPath, error=>{
                    //     if (error)
                    //         console.log(error);
                    //     fs.unlink(tempPath, error=>{
                    //         if (error){
                    //             console.log(error)
                    //         }
                            
                    //     });
                    // });
                    post.update(req.body, (err)=>{
                        if (err)
                            console.log(err);
                        return res.redirect("back");
                    });
                });
            })           
        } 
        else{
            post.update(req.body, (err)=>{
                if (err)
                    console.log(err);
                return res.redirect("back");
            });
        }       
    })
}
const postValidation = (req, res, next)=>{
    let post = req.body;
    if (!req.files && req.url.includes("newpost")){
        return res.send("Please, insert image");
    }
    else if (post.heading.length <= 10){
        return res.send("Please, insert heading bigger than 10 characters");  
    }
    else if (post.subheading.length <= 10){
        return res.send("Please, insert subheading bigger than 10 characters");  
    }    
    else if (post.url.length <= 3){
        return res.send("Please, insert URL bigger than 3 characters");  
    }
    else if (post.content.length <= 20){
        return res.send("Please, insert content bigger than 20 characters");  
    }
    else{
         //URL validation
        Post.findOne({url: post.url}, (err, postFound)=>{
            if (err){
                console.log(error);
                return res.send("Error while editing or creating post");
            }
            else if (postFound && post._id != postFound._id){
                return res.send("A post with this URL was already created");
            }
            else {
                next();
            }
        });
    }
    
}
module.exports = {
    newPostPage,
    postsPage,
    newPost,
    editPost,
    editPostPage,
    postValidation,
}