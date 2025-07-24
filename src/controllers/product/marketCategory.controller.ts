import { Request, Response } from "express";
import MarketCategory from "../../models/product/MarketCategory.model";

export const linkMarketCategory = async (req: Request, res: Response) => {
  try {
    const entry = new MarketCategory(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMarketCategories = async (_req: Request, res: Response) => {
  try {
    const data = await MarketCategory.find()
      .populate("marketId")
      .populate("categoryId");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
