import { Request, Response } from "express";
import Market from "../../models/product/market.model";
import MarketCategory from "../../models/product/MarketCategory.model";
import MarketProduct from "../../models/product/MarketProduct.model" ;


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


export const getMarketCategories = async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;

    // Optional: validate marketId exists
    const marketExists = await Market.findById(marketId);
    if (!marketExists) {
      return res.status(404).json({ message: 'Market not found' });
    }

    const categories = await MarketCategory.find({ marketId }).populate('categoryId');
    res.json(categories);
  } catch (error) {
    console.error('Error fetching market categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getProductsByMarketAndCategory = async (req, res) => {
  const { marketId, categoryId } = req.params;

  try {
    const products = await MarketProduct.find({
      market: marketId,
      category: categoryId,
    }).populate("product");

    const productList = products.map((entry) => ({
      _id: entry.product._id,
      name: entry.product.name,
      image: entry.product.image,
      // optionally include latest price data if needed
    }));

    res.status(200).json({
      marketId,
      categoryId,
      products: productList,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};
