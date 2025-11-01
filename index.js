const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blog");
const { connectToMongoDB } = require("./connect");
const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

require("dotenv").config(); 

const app = express();
const PORT = process.env.PORT;


connectToMongoDB(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({});
    res.render("home", {
      user: req.user,
      blogs: allBlogs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`Server Started at PORT : ${PORT}`));

module.exports = app;