import { Request, Response } from 'express';
import Price from '../../models/product/Price.model';

export const createPrice = async (req: Request, res: Response) => {
  try {
    const { productId, marketId, date, minPrice, maxPrice } = req.body;

    const newPrice = await Price.create({ productId, marketId, date, minPrice, maxPrice });

    res.status(201).json(newPrice);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create price entry', message: err });
  }
};

export const getPricesByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const prices = await Price.find({ productId }).sort({ date: -1 });
    res.json(prices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get prices', message: err });
  }
};
