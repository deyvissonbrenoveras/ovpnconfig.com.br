const path = require("path");

const uploadImage = (req, res)=>{
    let imageExtension = req.files.file.name.split(".").pop();
    let imagePath = `${Date.now()}.${imageExtension}`;
    req.files.file.mv(path.join(__dirname, `../images/posts/${imagePath}`), function(err){
        if (err)
            console.log(err);
        return res.json({location: imagePath});

    });
}

module.exports = {
    uploadImage
}