// types/RequestWithUser.ts

import { Request } from "express";


import { Response, NextFunction } from "express";


interface UserPayload {
  id: string;
  email: string;
  role: "admin" | "user" | string; // expand as needed
  // add any other fields your token includes
}

interface RequestWithUser extends Request {
  user?: UserPayload;
}

export const verifyAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
};
