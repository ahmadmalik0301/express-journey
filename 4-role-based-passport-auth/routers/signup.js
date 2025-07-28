const express = require("express");
const router = express.Router();
const signUpSchema = require("../validations/signUpSchema.js");
const prisma = require("../DB/db.js");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.status(200).json({ message: "This is Sign Up page" });
});

router.post("/", async (req, res) => {
  try {
    const { error, value } = signUpSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, name, age, password, secretKey } = value;

    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    let role = "user";
    if (secretKey) {
      if (secretKey === process.env.ADMIN_SECRET) {
        role = "admin";
      } else {
        return res.status(403).json({ message: "Invalid admin secret key" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        email,
        name,
        age,
        role,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered", role: user.role });
  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
