const express = require("express");
const app = express();

const passport = require("passport");
const passportJWT = require("./middlewares/passport-jwt.js");
require("dotenv").config();

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

// passport.authenticate("jwt", { session: false })

app.listen(3000, () => {
  console.log("http://localhost:3000");
});

app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});
