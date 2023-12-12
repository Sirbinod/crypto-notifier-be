import { NextFunction, Request, Response } from "express";
import { CryptoModel } from "../models/Crypto";
import { CommonResponse } from "../utils/commonResponse";
import { CryptoWithIdInterface } from "../interfaces/cryptoInterface";

interface PaginatedData<T> {
  items: T;
  pagination: {
    totalPages: number;
    totalItems: number;
    currentPage: number;
    perPage: number;
  };
}

export class CryptoController {
  public async getCryptoData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Pagination parameters
      const page: number = parseInt(req.query.page as string) || 1;
      const limit: number = parseInt(req.query.limit as string) || 100;
      const skip: number = (page - 1) * limit;

      // Search parameter
      const searchQuery: string = (req.query.search as string) || "";

      // MongoDB query to search and paginate
      const query: any = {};
      if (searchQuery) {
        query.$or = [
          { name: { $regex: new RegExp(searchQuery, "i") } },
          { code: { $regex: new RegExp(searchQuery, "i") } },
        ];
      }

      const data = await CryptoModel.find(query).skip(skip).limit(limit);
       // Count total documents without pagination
    const totalItems = await CryptoModel.countDocuments(query);

    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit);

    // Create response object with pagination information
    const response: CommonResponse<PaginatedData<CryptoWithIdInterface[]>> = {
      status: true,
      message: "Crypto coins found successfully",
      data: {
        items: data,
        pagination: {
          totalPages,
          totalItems,
          currentPage: page,
          perPage: limit,
        },
      },
    };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async getCryptoDataByCode(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { code } = req.params;
      const data = await CryptoModel.findOne({ code });

      if (!data) {
        // Handle the case when no data is found
        const response: CommonResponse<CryptoWithIdInterface> = {
          status: false,
          message: "Crypto coin not found",
          data: null!,
        };
        res.status(404).json(response);
        return;
      }

      const response: CommonResponse<CryptoWithIdInterface> = {
        status: true,
        message: "Crypto coin found successfully",
        data: data as CryptoWithIdInterface,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
