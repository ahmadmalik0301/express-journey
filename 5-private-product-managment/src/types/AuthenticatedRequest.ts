import { Request } from "express";

export interface UserPayload {
  id: number;
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload;
}
