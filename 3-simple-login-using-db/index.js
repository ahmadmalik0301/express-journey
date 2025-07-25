const express = require("express");
const app = express();
const prisma = require("./db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

const SECRET = process.env.SECRET;
const joi = require("joi");

const signUpScheme = joi.object({
  username: joi
    .string()
    .pattern(/^[a-zA-Z0-9._-]+$/)
    .min(3)
    .max(10)
    .required(),

  password: joi.string().min(3).max(10).required(),

  age: joi.number().integer().min(12).required(),

  name: joi.string().min(1).max(100).required(),
});

app.use(express.json());

async function userExist(username) {
  const user = await prisma.users_test.findFirst({
    where: { username },
  });
  return !!user;
}
async function login(req, res, next) {
  const { username, password } = req.body;

  try {
    const exist = await userExist(username);
    if (!exist)
      return res.status(401).json({ message: "No Such username Exist" });
    const user = await prisma.users_test.findFirst({
      where: { username },
    });
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      return next();
    } else {
      return res.status(401).json({ message: "Wrong password" });
    }
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  const { error } = signUpScheme.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const { username, password, age, name } = req.body;

  try {
    const exist = await userExist(username);
    if (exist) {
      return res.status(409).json({ message: "This user already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.users_test.create({
      data: {
        username,
        password: hashedPassword,
        age,
        name,
      },
    });

    next();
  } catch (err) {
    next(err);
  }
}
function verifyToken(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "You does not have any Auth token" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = jwt.verify(token, SECRET);
    console.log(user.name);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Your token is invalid." });
  }
}

app.get("/", (req, res) => {
  res.status(200).json({ message: "This is Home page" });
});

app.get("/login", (req, res) => {
  res.status(200).json({ message: "This is Login page" });
});

app.post("/signup", createUser, (req, res) => {
  res.status(201).json({ message: "User Created Successfully" });
});
app.post("/login", login, (req, res) => {
  const { username, password } = req.body;
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
  res.status(200).json({ message: "Welcome You are Logged in", token });
});

app.get("/signup", (req, res) => {
  res.status(200).json({ message: "This is Sign Up Page" });
});
app.get("/secret", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to Secret page" });
});
app.use((req, res) => {
  res.status(404).json({ message: "404 Page Does not Exist" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Something Went wrong in the Server" });
});

app.listen(8080, "0.0.0.0", () => {
  console.log("Server running on http://10.200.10.9:8080");
});
