import { Request, Response } from "express";
import MarketProduct from "../../models/product/MarketProduct.model";
import Product from "../../models/product/product.model";
import Price from '../../models/product/Price.model';
import mongoose from "mongoose";
import { PopulatedProduct, QueryParams } from "../../types/common";


export const linkMarketProduct = async (req: Request, res: Response) => {
  try {
    const {marketId, categoryId, productId} = req.body;

    const existingMarketProductLink = await MarketProduct.findOne({ marketId, categoryId, productId });

    if(existingMarketProductLink){
      return res.status(409).json({ message: "The link of marketId & categoryId & productId is already exist" });
    }
    
    const entry = new MarketProduct(req.body);
    const saved = await entry.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};

export const getMarketProducts = async (_req: Request, res: Response) => {
  try {
    const data = await MarketProduct.find()
      .populate("marketId")
      .populate("productId");
    res.json(data);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};


// search controller for products
// based on categoryId
export const getProductsByMarketAndCategory = async (req: Request, res: Response)  => {
  try {
    const { marketId } = req.params;
    const { product="" } = req.query;
    const rawCategoryId = req.query.categoryId;


    const productSearchTerm = typeof product === "string" ? product.trim() : ""; 
    
    const categoryId = typeof rawCategoryId === "string" ? rawCategoryId : null;


    if (!marketId || !mongoose.Types.ObjectId.isValid(marketId)) {
      return res.status(400).json({ message: "Valid marketId is required" });
    }

    const matchStage: Record<string, any> = {
      marketId: new mongoose.Types.ObjectId(marketId),
    };

    if (categoryId != 'all' && categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
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

      // Optional product name filter (after joining with products)
      ...(productSearchTerm
      ? [
          {
            $match: {
              "product.name": {
                $regex: new RegExp(productSearchTerm.trim(), 'i'), // Case-insensitive match
              },
            },
          },
        ]
      : []),

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
    // res.status(500).json({ message: "Failed to get market products", error: err.message });
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Failed to get market products" });
    }
  }
};



// single product details with price and category by productId and marketId
export const getSingleProductDetail = async (req: Request, res: Response)  => {
  try {
    const { marketId, productId } = req.params;

    const { days = '6' } = req.query as QueryParams;
    const parsedDays = parseInt(days); // fallback to 30 if not provided

    // Validate inputs
    if (!mongoose.Types.ObjectId.isValid(marketId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid marketId or productId" });
    }

    if (isNaN(parsedDays) || parsedDays < 1 || parsedDays > 90) {
      return res.status(400).json({ message: "Query param 'days' must be a number between 1 and 90" });
    }

    // 1. Ensure product exists in market
    const marketProduct = await MarketProduct.findOne({ marketId, productId }).lean();
    if (!marketProduct) {
      return res.status(404).json({ message: "Product not found in the specified market." });
    }
 
    // 2. Fetch product with category
    const product = await Product.findById(productId)
      .populate("categoryId", "name")
      .lean<PopulatedProduct>();

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // 3. Date filter for price history
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parsedDays);

    const priceHistory = await Price.find({
      productId,
      marketId,
      createdAt: { $gte: fromDate }
    })
      .sort({ createdAt: -1 })
      .lean();

    // 4. Build response
    return res.json({
      product: {
        id: product._id,
        name: product.name,
        category: {
          id: product.categoryId?._id,
          name: product.categoryId?.name
        }
      },
      price: priceHistory
    });

  } catch (err) {
    console.error("getSingleProductDetail error:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};
