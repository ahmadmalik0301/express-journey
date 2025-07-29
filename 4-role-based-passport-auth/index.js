require("dotenv").config();

const express = require("express");
const passport = require("passport");
const app = express();

const passportJWT = require("./middlewares/passport-jwt.js");
const signUpRouter = require("./routers/signup.js");
const loginRouter = require("./routers/login.js");
const productRouter = require("./routers/products.js");

passportJWT(passport);

app.use(express.json());
app.use(passport.initialize());

app.use("/signup", signUpRouter);
app.use("/login", loginRouter);

app.use(
  "/products",
  passport.authenticate("jwt", { session: false }),
  productRouter
);

app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
