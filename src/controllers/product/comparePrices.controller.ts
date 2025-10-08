import { Request, Response } from "express";
import MarketProduct from "../../models/product/MarketProduct.model";
import Price, { IPrice } from '../../models/product/Price.model';
import { IProduct } from "../../models/product/product.model";
import mongoose from "mongoose";

interface ProductCompare {
  productId: string;
  name: string;
  image: string;
  market1: { minPrice: number; maxPrice: number } | null;
  market2: { minPrice: number; maxPrice: number } | null;
}

// TODO: login not working properly
// maybe after applying filter changes
export const comparePrices = async (req: Request, res: Response) => {
  try {
    const { market1Id, market2Id, categoryId, date } = req.query as {
      market1Id: string;
      market2Id: string;
      categoryId?: string;
      date?: string;
    };

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    if (!market1Id || !market2Id) {
      return res.status(400).json({ message: "Both market IDs are required." });
    }

    // Build a dynamic query object to filter by categoryId (if provided).
    // We ensure categoryId is a valid MongoDB ObjectId before using it in the query
    // to prevent runtime errors or injection vulnerabilities.
    const query: Record<string, any> = {};
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
    query.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    const market1Products = await MarketProduct.find({
      ...query,
      marketId: market1Id
    })
      .populate("productId")
      .lean();

    const market2Products = await MarketProduct.find({
      ...query,
      marketId: market2Id
    })
      .populate("productId")
      .lean();

    const productsMap: Record<string, ProductCompare> = {};

    for (const mp of market1Products) {
      const id = String(mp.productId._id);
      productsMap[id] = {
        productId: id,
        name: mp.productId.name,
        image: mp.productId.image || "",
        market1: null,
        market2: null
      };
    }

    for (const mp of market2Products) {
      const id = String(mp.productId._id);
      if (!productsMap[id]) {
        productsMap[id] = {
          productId: id,
          name: mp.productId.name,
          image: mp.productId.image || "",
          market1: null,
          market2: null
        };
      }
    }

    // const allProductIds = Object.keys(productsMap).map(id => new mongoose.Types.ObjectId(id));

    // Pagination logic here
    const allProductIds = Object.keys(productsMap);
    const paginatedIds = allProductIds.slice(skip, skip + limit);
    const paginatedMap: Record<string, ProductCompare> = {};
    for (const id of paginatedIds) {
      paginatedMap[id] = productsMap[id];
    }

    const selectedProductObjectIds = paginatedIds.map(id => new mongoose.Types.ObjectId(id));

    // Use today's date if no date is provided
    // Normalize date safely to UTC boundaries
    let inputDate = new Date(); // default to today
    if (date && !isNaN(new Date(date).getTime())) {
      inputDate = new Date(date);
    }

    const startOfDay = new Date(inputDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(inputDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

   // need to remove time form date before compare the price
    const prices: IPrice[] = await Price.find({
      productId: { $in: selectedProductObjectIds },
      marketId: { $in: [market1Id, market2Id].map(id => new mongoose.Types.ObjectId(id)) },
       date: { $gte: startOfDay, $lt: endOfDay },
    }).lean();


    for (const p of prices) {
      const id = String(p.productId);
      if (!productsMap[id]) continue;

      if (String(p.marketId) === market1Id) {
        productsMap[id].market1 = { minPrice: p.minPrice, maxPrice: p.maxPrice };
      } else if (String(p.marketId) === market2Id) {
        productsMap[id].market2 = { minPrice: p.minPrice, maxPrice: p.maxPrice };
      }
    }

    res.json(Object.values(productsMap));
  } catch (err) {
    console.error("Error in comparePrices:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};
 
