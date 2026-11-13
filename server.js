const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = 3000;

// Connect to MongoDB - change this if yours is different
mongoose.connect("mongodb://127.0.0.1:27017/26csel37")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// REGISTER - After register -> ONLY LOGIN page
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.redirect("/register.html?error=exists");
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    console.log("user registered", email);
    res.redirect("/login.html");
  } catch (err) {
    console.log(err);
    res.redirect("/register.html?error=true");
  }
});

// LOGIN - After login -> HOME page
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.redirect("/login.html?error=invalid");
    }
    if (user.password !== password) {
      return res.redirect("/login.html?error=invalid");
    }
    console.log("user logged in", email);
    res.redirect("/index.html?status=loggedin");
  } catch (err) {
    console.log(err);
    res.redirect("/login.html?error=true");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:3000`);
});