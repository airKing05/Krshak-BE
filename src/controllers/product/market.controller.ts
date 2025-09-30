import { Request, Response } from "express";
import Market from "../../models/product/market.model";
import { doRegex, stringToLowerCase } from "../../utils/formatDate";
import mongoose from "mongoose";
import { getCoordinatesFromLocation } from "../../services/geocoding.service";


export const createMarket = async (req: Request, res: Response) => {
  try {
    const {name, city, district} = req.body
    const normalizedName = stringToLowerCase(name);
    const normalizedCity = stringToLowerCase(city);
    const normalizedDistrict = stringToLowerCase(district);

    // Check if the combination already exists
    const existingMarket = await Market.findOne({
     name: { $regex: doRegex(normalizedName) }, 
     city: { $regex: doRegex(normalizedCity) }, 
     district: { $regex: doRegex(normalizedDistrict) }
    });

    if (existingMarket) {
      return res.status(409).json({
        error: 'A market entry for this name, city, and district already exists.',
      });
    }

    //Get coordinates
    const { lat, lng } = await getCoordinatesFromLocation(city, district, "rajasthan");

    const market = new Market({
      ...req.body,
      lat,
      lng
    });
    const saved = await market.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown error" });
    }
  }
};


export const getAllMarkets = async (_req: Request, res: Response) => {
  try {
    const markets = await Market.find();
    res.json(markets);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};

export const getMarketByMarketId = async (_req: Request, res: Response) => {
  try {
    const { marketId } = _req.params;

    if (!marketId || !mongoose.Types.ObjectId.isValid(marketId)) {
      return res.status(400).json({ message: "Valid marketId is required" });
    }

    const market = await Market.findById(marketId);
    res.json(market);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error" });
    }
  }
};











