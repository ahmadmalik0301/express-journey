const express = require("express");
const loginScheme = require("../validations/loginSchema.js");
const router = express.Router();
const prisma = require("../DB/db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/", (req, res) => {
  res.status(200).json({ message: "This is Login Page" });
});

router.post("/", async (req, res) => {
  try {
    const { error, value } = loginScheme.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password } = value;

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) return res.status(400).json({ message: "No such user exists" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Password does not match" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Login Successful", token });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
