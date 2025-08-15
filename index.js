const express = require("express");
const connectToMongoDB = require("./config/connect");
const authRouter = require("./routes/authRourtes");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");
const blogRouter = require("./routes/blog");
const Blog = require("./model/blog");
const blog = require("./model/blog");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT;

app.set("view engine","ejs");
app.set("views","./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static("public"));

app.get("/", async (req,res)=>{
    const allBlogs = await Blog.find({}).sort({ createdAt: -1 }) ;
    res.render("home", {user : req.user, blogs: allBlogs});
})
app.get("/signup",(req,res)=>{    
    res.render("signup");
})
app.get("/signin",(req,res)=>{
    res.render("signin");
});

app.get("/about",(req,res)=>{
    return res.render("about");
})

app.use(blogRouter);
app.use(authRouter);
app.use((req,res)=>{
    res.status(404).render("pnf");
})

connectToMongoDB(process.env.MONGO_URL);
app.listen(PORT,()=>{
    console.log(`Server is started on port http://127.0.1:${PORT}`);
})