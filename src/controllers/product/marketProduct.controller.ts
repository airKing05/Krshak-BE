import { Request, Response } from "express";
import MarketProduct from "../../models/product/MarketProduct.model";
import mongoose from "mongoose";


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


// search controller for products
// based on categoryId
export const getProductsByMarketAndCategory = async (req, res) => {
  try {
    const { marketId } = req.params;
    const { categoryId } = req.query;

    if (!marketId || !mongoose.Types.ObjectId.isValid(marketId)) {
      return res.status(400).json({ message: "Valid marketId is required" });
    }

    const matchStage = {
      marketId: new mongoose.Types.ObjectId(marketId),
    };

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      matchStage.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    const result = await MarketProduct.aggregate([
      { $match: matchStage },

      // Join with Product
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },

      // Join with Category
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $unwind: "$category" },

      // Join with Price collection — Get ALL prices first
      {
        $lookup: {
          from: "prices",
          let: { pid: "$product._id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$productId", "$$pid"] } } },
            { $sort: { createdAt: -1 } },
            { $limit: 1 }
          ],
          as: "latestPrice"
        }
      },
      {
        $unwind: {
          path: "$latestPrice",
          preserveNullAndEmptyArrays: true // if some products don’t have prices yet
        }
      },

      // Final shaping
      {
        $project: {
          _id: "$product._id",
          name: "$product.name",
          marketId: 1,
          category: {
            _id: "$category._id",
            name: "$category.name"
          },
          latestMaxPrice: "$latestPrice.maxPrice"
        }
      }
    ]);

    res.status(200).json({
      marketId,
      categoryId: categoryId || null,
      count: result.length,
      products: result
    });

  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Failed to get market products", error: err.message });
  }
};


