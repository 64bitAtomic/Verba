const authRouter = require("express").Router();
const User = require("../model/user");
authRouter.post("/signup", async (req, res) => {
  try {
    console.log("Received signup request:", req.body);
    const { username, email, password } = req.body;
    console.log(`Username: ${username}, Email: ${email}, Password: ${password}`);
    if ( await User.findOne({ email })) return res.redirect("/");
    console.log("Creating user with username:", username);
    const user = await User.create({ username, email, password });
    console.log("User created successfully:", user);
    return res.redirect("/");
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      error: error
    });
  }
});

authRouter.post("/signin",async(req,res)=>{
    const {email,password} = req.body;
    try{
        const token = await User.matchPasswordAndGenerateToken(email,password);
    res.cookie("token",token).redirect("/");
    }catch(error){
        return res.render("signin",{ error: "Incorrect email or password"});
    }
});

authRouter.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})

module.exports = authRouter;
