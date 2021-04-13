const Post = require("../models/Post");
const home = (req, res)=>{
    Post.find({published: true}, (err, posts)=>{
        if (err){
            console.log(err);
            return res.send("Error while retrieving data");
        }
        else {
            return res.render("./blog/home", {posts});
        }
    });
}
const post = (req, res)=>{
    Post.findOne({url: req.params.postUrl, published: true}, (err, post)=>{
        if (err){
            console.log(err);
            return res.send("Error while retrieving data");
        }
        else{
            if (!post)
                return res.send("Post not found");
            Post.find({published: true}, (err, posts)=>{
                var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                return res.render("./blog/post", {post, posts, url: fullUrl});
            }).sort({_id:-1})
            .limit(5)
            .select("heading").select("url");            
        }
    }).populate("publisher");
}

module.exports = {
    home,
    post
}