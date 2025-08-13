import dotenv from "dotenv";
dotenv.config();
import path from "path";
import YAML from "yamljs";

const swaggerDocument = YAML.load(
  path.join(process.cwd(), "swagger", "swagger.yaml")
);

import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import registrationRouter from "./registration/registrationRouter.js";
import loginRouter from "./login/loginRouter.js";
import authenticateJWT from "./middleware/authenticateJWT.js";
import productRouter from "./products/productRouter.js";

const app = express();
app.use(express.json());
app.use("/registration", registrationRouter);
app.use("/login", loginRouter);
app.use("/product", authenticateJWT, productRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "404-Page Not found" });
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error.message);
  res.status(500).json({ message: "505 - Internal Server Error" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
