const blogRouter = require("express").Router();
const multer = require("multer");
const path = require("path");
const Blog = require("../model/blog");
const Comment = require("../model/comment"); 
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(__dirname,`../public/uploads`))
    },
    filename: (req,file,cb)=>{
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null,filename);
    }
})

const uploads = multer({storage: storage});
blogRouter.get("/add-new",(req,res)=>{
    res.render("addBlog",{ user : req.user});
});

blogRouter.get("/blog/:id",async (req,res)=>{
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({ blogId: blog._id }).populate("createdBy");
    console.log(blog.createdBy.profileImage);
    
    res.render("blog",{ user: req.user, blog: blog, comments: comments });
})

blogRouter.get("/blogs/myblogs",async(req,res)=>{
    if(!req.user){
        return res.redirect("/signin");
    }
    const blogs = await Blog.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    
    res.render("myBlogs",{ user: req.user, blogs: blogs });
})

blogRouter.post('/blog/delete/:id', async (req, res) => {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs/myblogs'); 
});

blogRouter.post("/comment/:blogId", async(req,res)=>{
    if(!req.user){
        return res.redirect("/signin")
    }
    await Comment.create({ 
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})

blogRouter.post("/add-new",uploads.single('coverImage'),async(req,res)=>{
    const { title, body } = req.body;
    const blog = await Blog.create({ 
        body,
        title,
        createdBy: req.user._id,
        coverImage: `uploads/${req.file.filename}`,
    });
    return res.redirect(`/blog/${blog._id}`);
})

module.exports = blogRouter;