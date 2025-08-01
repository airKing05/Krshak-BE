import { Request, Response } from "express";
import Category from "../../models/product/category.model";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new Category(req.body);
    const saved = await category.save();
    res.status(201).json(saved);
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Internal server error." });
    }
  }
};

export const getAllCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal server error." });
    }
  }
};
