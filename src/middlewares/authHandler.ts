import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
    userId?: string; 
  }

const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(403).json({ status: false, message: 'Unauthorized access!', });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET as string
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.userId = decoded.userId
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError)
      return res.status(401).json({ status: false, message: 'Token Expired' });
    return res.status(403).json({ status: false, message: 'Token not valid' });
  }
};

export default isAuthenticated;