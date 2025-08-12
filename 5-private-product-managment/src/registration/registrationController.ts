import { Request, Response, NextFunction } from "express";
import registrationScheme from "./registrationScheme.js";
import prisma from "../DB/DB.js";
import bcrypt from "bcrypt";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = registrationScheme.validate(req.body);
    if (error) return res.status(400).json({ message: error.message });

    const {
      first_name,
      last_name,
      age,
      phone_number,
      email,
      country,
      address,
      password,
    } = value;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail)
      return res
        .status(409)
        .json({ message: "User with this Email already Exist" });

    const existingPhone = await prisma.user.findFirst({
      where: {
        phone_number,
      },
    });
    if (existingPhone)
      return res
        .status(409)
        .json({ message: "User with this Phone Number already Exist" });
    const user = await prisma.user.create({
      data: {
        first_name,
        last_name,
        age,
        phone_number,
        email,
        country,
        address,
        password: hashedPassword,
      },
    });
    return res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
