import { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { CommonResponse } from "../utils/commonResponse";
import { TokenInterface, UserInterface } from "../interfaces/userInterface";

export class UserController {
  public async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await UserModel.create(req.body);
      const response: CommonResponse<UserInterface> = {
        status: true,
        message: "User register successfully",
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async loginUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
      if (!user) {
        res.status(400).json({ status: false, message: "Invalid email!" });
      }

      const isMatch = await bcrypt.compare(password, user!.password);
      if (!isMatch) {
        res.status(400).json({ status: false, message: "Invalid password!" });
      }
      const jwtSecret = process.env.JWT_SECRET as string;

      const token = jwt.sign({ userId: user!._id }, jwtSecret, {
        expiresIn: "5h",
      });
      const response: CommonResponse<TokenInterface> = {
        status: true,
        message: "Login successfully",
        data: { token },
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
