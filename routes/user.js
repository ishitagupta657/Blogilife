const { Router } = require("express");
const User = require("./../models/user");
const router = Router();
router.get("/signin", (req, res) => {
    return res.render("signin");
});
router.get("/signup", (req, res) =>{
    return res.render("signup");
});
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
 
        if (!email || !password) {
            return res.render("signin", {
                error: "Please provide both email and password",
            });
        }

        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
        
    } catch (error) {
        console.error("Signin error:", error);
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
    }
});
router.get("/logout", (req, res) => {
    res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
    const { fullName, email, password } = req.body;
    
    try {
       
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", {
                error: "User with this email already exists",
            });
        }

      
        const user = await User.create({
            fullName,
            email,
            password,
        });

      
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
        
    } catch (error) {
        console.error("Signup error:", error);
        return res.render("signup", {
            error: "Failed to create account. Please try again.",
        });
    }
});
module.exports = router;
