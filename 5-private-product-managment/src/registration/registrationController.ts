import { Request, Response, NextFunction } from "express";
import registrationScheme from "./registrationScheme.js";
import prisma from "../DB/DB.js";
import bcrypt from "bcrypt";
import UserInterface from "../types/UserInterface.js";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value }: { error: any; value: Omit<UserInterface, "id"> } =
      registrationScheme.validate(req.body);
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

    const hashedPassword: string = await bcrypt.hash(password, 10);

    const existingEmail: UserInterface | null = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail)
      return res
        .status(409)
        .json({ message: "User with this Email already Exist" });

    const existingPhone: UserInterface | null = await prisma.user.findFirst({
      where: {
        phone_number,
      },
    });
    if (existingPhone)
      return res
        .status(409)
        .json({ message: "User with this Phone Number already Exist" });
    const user: UserInterface | null = await prisma.user.create({
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
