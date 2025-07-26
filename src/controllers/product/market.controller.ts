import { Request, Response } from "express";
import Market from "../../models/product/market.model";


export const createMarket = async (req: Request, res: Response) => {
  try {
    const market = new Market(req.body);
    const saved = await market.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const getAllMarkets = async (_req: Request, res: Response) => {
  try {
    const markets = await Market.find();
    res.json(markets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};











