import { Request, Response, NextFunction } from "express";
import loginScheme from "./loginScheme.js";
import prisma from "../DB/DB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import LoginInterface from "../types/LoginInterface.js";
import UserInterface from "../types/UserInterface.js";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value }: { error: any; value: LoginInterface } =
      loginScheme.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const { email, password }: LoginInterface = value;
    const user: UserInterface | null = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user)
      return res.status(401).json({
        message:
          "Invalid Credidential- Create New account or Recheck Credidential",
      });
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid Credidential" });
    const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET NOT FOUND!");
    }
    const token: string = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (error: any) {
    console.error(error);
    next(error);
  }
};
