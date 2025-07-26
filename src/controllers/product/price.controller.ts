import { Request, Response } from 'express';
import Price from '../../models/product/Price.model';

export const createPrice = async (req: Request, res: Response) => {
  try {
    const { productId, marketId, date, minPrice, maxPrice } = req.body;

    // Check if the combination already exists
    const existingPrice = await Price.findOne({
      productId,
      marketId,
      date: new Date(date), // Ensure date is compared correctly
    });

    if (existingPrice) {
      return res.status(409).json({
        error: 'A price entry for this product, market, and date already exists.',
      });
    }

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
