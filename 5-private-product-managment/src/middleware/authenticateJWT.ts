import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserPayload, AuthenticatedRequest } from "../types/UserPayload.js";

const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token: string = authHeader.split(" ")[1]!;
  jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = decoded as UserPayload;
    next();
  });
};

export default authenticateJWT;
