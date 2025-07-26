import { Request, Response } from "express";
import MarketCategory from "../../models/product/MarketCategory.model";
import Category from "../../models/product/category.model";
import Market from "../../models/product/market.model";
import mongoose from "mongoose";


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



export const getCategoriesByMarketId = async (req: Request, res: Response) => {
  try {
    const { marketId } = req.params;

    // // Optional: validate marketId exists
    // const marketExists = await Market.findById(marketId);
    // if (!marketExists) {
    //   return res.status(404).json({ message: 'Market not found' });
    // }

    //  // Get all category IDs linked with this market
    // const categoriesLinks = await MarketCategory.find({ marketId }).distinct('categoryId');

    // // Fetch full category details
    // const categories = await Category.find({ _id: { $in: categoriesLinks } });
    // res.json(categories);


    const result = await MarketCategory.aggregate([
    { $match: { marketId: new mongoose.Types.ObjectId(marketId) } },
    {
      $lookup: {
        from: "categories", // actual name of the Category collection (usually lowercase plural)
        localField: "categoryId",
        foreignField: "_id",
        as: "category"
      }
    },
    { $unwind: "$category" },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ["$category", { marketId: "$marketId" }]
        }
      }
    }
  ]);

  res.json(result);

    
  } catch (error) {
    console.error('Error fetching market categories:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
