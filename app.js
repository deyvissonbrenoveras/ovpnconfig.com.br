require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT;
const appRoute = require("./routes/appRoute");
const path = require("path");
const compress = require("compression");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");


const fileUpload = require("express-fileupload");

//DatBase
mongoose.connect(process.env.MONGODB_STRING, {useNewUrlParser:true, useUnifiedTopology: true}, (error)=>{
    if (error)
        console.log(error)
    else
        console.log("Connected to Database");
});

//Blog Routers
const blogRouter = require("./blog/routes/blogRouter");
const postRouter = require("./blog/routes/postRouter");
const publisherRouter = require("./blog/routes/publisherRouter");
const loginRouter = require("./blog/routes/loginRouter");
const imageRouter = require("./blog/routes/imageRouter")
const userRouter = require("./routes/userRoute");
const buyRouter = require("./routes/buyRoute");
const authController = require("./blog/controllers/authController");

app.set("view engine", "ejs");
app.set("Views", path.join(__dirname, "views"));

 
//Compressão gzip
app.use(compress());

//Cookie Parser
app.use(cookieParser());

//SITE
app.use("/", appRoute);
app.use("/scripts", express.static(path.join(__dirname, "scripts")));
app.use("/styles", express.static(path.join(__dirname, "styles")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/sitemaps", express.static(path.join(__dirname, "sitemaps")));

//Blog
app.use("/blog/styles", express.static(path.join(__dirname, "/blog/styles")));
app.use("/blog/images", express.static(path.join(__dirname, "/blog/images")));
app.use("/blog", blogRouter);

//User
app.use("/user", express.urlencoded(), userRouter);

//buy
app.use("/buy", express.urlencoded(), buyRouter);
//Blog Editor
let fileUploadOptions = {
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "./images/temp"),
};
app.use("/blog/editor",
    express.urlencoded({extended: true}),    
    fileUpload(fileUploadOptions),    
    authController,
    loginRouter,
    imageRouter,
    postRouter,
    publisherRouter
);


app.listen(port, () => { console.log("Servidor rodando na porta ", port) });
