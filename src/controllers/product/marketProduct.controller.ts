import { Request, Response } from "express";
import MarketProduct from "../../models/product/MarketProduct.model";

export const linkMarketProduct = async (req: Request, res: Response) => {
  try {
    const entry = new MarketProduct(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMarketProducts = async (_req: Request, res: Response) => {
  try {
    const data = await MarketProduct.find()
      .populate("marketId")
      .populate("productId");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
