import mongoose from "mongoose";
import { IProduct } from "../models/product/product.model";

export interface PopulatedProduct {
  _id: string;
  name: string;
  categoryId: {
    _id: string;
    name: string;
  };
}

export interface QueryParams {
  days?: string;
}


