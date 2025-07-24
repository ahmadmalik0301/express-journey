const express = require("express");
const app = express();
const prisma = require("./db");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET = process.env.SECRET;

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
    if (user.password === password) {
      return next();
    } else {
      return res.status(401).json({ message: "Wrong password" });
    }
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  const { username, password, age, name } = req.body;

  if (!username)
    return res.status(400).json({ message: "Username is missing" });
  if (!password)
    return res.status(400).json({ message: "Password is missing" });
  if (!age) return res.status(400).json({ message: "Age is missing" });
  if (!name) return res.status(400).json({ message: "Name is missing" });

  try {
    const exist = await userExist(username);
    if (exist) {
      return res.status(409).json({ message: "This user already exists" });
    }

    await prisma.users_test.create({
      data: { username, password, age, name },
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
    return res.status(400).json({ message: "Your token is invalid." });
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
  const token = jwt.sign(username, SECRET);
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

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
