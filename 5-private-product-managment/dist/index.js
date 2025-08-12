import dotenv from "dotenv";
dotenv.config();
import express from "express";
import registrationRouter from "./registration/registrationRouter.js";
import loginRouter from "./login/loginRouter.js";
import authenticateJWT from "./middleware/authenticateJWT.js";
const app = express();
app.use(express.json());
app.use("/registration", registrationRouter);
app.use("/login", loginRouter);
app.get("/product", authenticateJWT, (req, res) => {
    res.json({ message: "This is product page" });
});
app.use((req, res) => {
    res.status(404).json({ message: "404-Page Not found" });
});
app.use((error, req, res) => {
    res.status(500).json({ message: "505- Internal Server Error" });
});
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
