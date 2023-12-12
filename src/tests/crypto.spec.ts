import { Request, Response, NextFunction } from "express";
import { CryptoController } from "../controllers/cryptoController";
import { CryptoModel } from "../models/Crypto";
import { CommonResponse } from "../utils/commonResponse";
import { CryptoWithIdInterface } from "../interfaces/cryptoInterface";
import mongoose from "mongoose";

jest.mock("../models/Crypto"); // Mocking CryptoModel

describe('CryptoController', () => {
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      query: {},
      params:{}
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    next = jest.fn();
  });

  describe('getCryptoData', () => {
    it('should return paginated crypto data', async () => {
   const fakeCryptoData: CryptoWithIdInterface[] = [
     {
       _id: new mongoose.Types.ObjectId(),
       name: "Bitcoin",
       code: "BTC",
       image: "image",
       price: 999,
       marketCap: 9999,
       change24h: -2,
     },
     {
       _id: new mongoose.Types.ObjectId(),
       name: "Ethereum",
       code: "ETH",
       image: "image",
       price: 999,
       marketCap: 9999,
       change24h: -2,
     },
   ];

      const countDocumentsMock = jest.spyOn(CryptoModel, 'countDocuments');
      countDocumentsMock.mockResolvedValue(2);

      const findMock = jest.spyOn(CryptoModel, 'find');
      findMock.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(fakeCryptoData),
        }),
      } as any);

      await CryptoController.prototype.getCryptoData(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'Crypto coins found successfully',
        data: {
          items: fakeCryptoData,
          pagination: {
            totalPages: 1,
            totalItems: 2,
            currentPage: 1,
            perPage: 100,
          },
        },
      });
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      const findMock = jest.spyOn(CryptoModel, 'find');
      findMock.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockRejectedValue(error),
        }),
      } as any);

      await CryptoController.prototype.getCryptoData(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });


  describe("getCryptoDataByCode", () => {
    it("should return crypto data by code", async () => {
      const fakeCryptoData: CryptoWithIdInterface = {
        _id: new mongoose.Types.ObjectId(),
        name: "Bitcoin",
        code: "BTC",
        image: "image",
        price: 999,
        marketCap: 9999,
        change24h: -2,
      };

      const findOneMock = jest.spyOn(CryptoModel, "findOne");
      findOneMock.mockResolvedValue(fakeCryptoData);

      req.params = { code: "BTC" };

      await CryptoController.prototype.getCryptoDataByCode(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: "Crypto coin found successfully",
        data: fakeCryptoData,
      });
    });

    it("should handle not finding crypto data", async () => {
      const findOneMock = jest.spyOn(CryptoModel, "findOne");
      findOneMock.mockResolvedValue(null);

      req.params = { code: "XYZ" };

      await CryptoController.prototype.getCryptoDataByCode(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: "Crypto coin not found",
        data: null,
      });
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      const findOneMock = jest.spyOn(CryptoModel, "findOne");
      findOneMock.mockRejectedValue(error);

      await CryptoController.prototype.getCryptoDataByCode(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
