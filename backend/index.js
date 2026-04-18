const express = require('express');
const app = express();
const cors = require("cors");
const usermodel = require("./models/user");
const postmodel = require("./models/post");
const bcrypt = require('bcrypt');
const cookieparser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { connectDb } = require('./models/db');

// --- Middlewares ---
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// --- Auth Middleware ---
const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ success: false, msg: "You must be logged in" });

  try {
    const data = jwt.verify(token, "shhhh");
    req.user = data;
    next();
  } catch (err) {
    res.status(401).json({ success: false, msg: "Invalid Token" });
  }
};

// --- Routes ---

app.get('/', (req, res) => {
  res.json({ msg: "Server is running!" });
});

// Verify cookie & return user
app.get("/verify", isLoggedIn, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

// Create a post  ✅ FIX: await the DB call + use correct field name + save userId
app.post("/post", isLoggedIn, async (req, res) => {
  try {
    const { content } = req.body;  // frontend sends { content }

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, msg: "Post content cannot be empty" });
    }

    const postData = await postmodel.create({  // ✅ await added
      content,
      user: req.user.userid,  // ✅ link post to logged-in user
    });

    return res.status(201).json({ success: true, msg: "Post created!", post: postData });
  } catch (err) {
    console.error("Post error:", err.message);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// Get all posts for the logged-in user
app.get("/posts", isLoggedIn, async (req, res) => {
  try {
    const posts = await postmodel.find({ user: req.user.userid }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
});

// Logout  ✅ FIX: clearCookie second arg must be options object, not a string
app.post('/logout', (req, res) => {
  res.clearCookie("token", {});  // ✅ {} not ""
  res.json({ success: true, msg: "Logged out successfully" });
});

// Register
app.post('/register', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existing = await usermodel.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already registered!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await usermodel.create({ name, username, email, password: hashedPassword });

    res.json({ success: true, msg: "Registered successfully!" });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await usermodel.findOne({ email: Email });
    if (!user) {
      return res.status(400).json({ success: false, msg: "Wrong credentials" });
    }

    const match = await bcrypt.compare(Password, user.password);
    if (!match) {
      return res.status(400).json({ success: false, msg: "Wrong password" });
    }

    const token = jwt.sign(
      { email: Email, userid: user._id, username: user.username },
      "shhhh"
    );
    res.cookie("token", token, { httpOnly: true });  // ✅ httpOnly for security
    return res.status(200).json({ success: true, msg: "Logged in successfully" });

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ success: false, msg: err.message });
  }
});

// --- Server Startup ---
app.listen(3000, () => {
  connectDb();
  console.log('Server running on http://localhost:3000');
});
module.exports = app;