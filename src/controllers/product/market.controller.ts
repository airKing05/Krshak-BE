import { Request, Response } from "express";
import Market from "../../models/product/market.model";
import { doRegex, stringToLowerCase } from "../../utils/formatDate";


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











