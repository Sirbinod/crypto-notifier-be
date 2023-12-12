import {  Types } from "mongoose";

export interface CryptoInterface {
    image: string;
    name: string;
    code: string;
    price: number;
    marketCap: number;
    change24h: number;
  }

  export interface CryptoWithIdInterface extends CryptoInterface {
    _id: Types.ObjectId;
  }