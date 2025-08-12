import { Request, Response, NextFunction } from "express";
import loginScheme from "./loginScheme.js";
import prisma from "../DB/DB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = loginScheme.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password } = value;
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user)
      return res.status(401).json({
        message:
          "Invalid Credidential- Create New account or Recheck Credidential",
      });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid Credidential" });
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET NOT FOUND!");
    }
    const token = jwt.sign(
      { email: user.email, name: `${user.first_name} ${user.last_name}` },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
