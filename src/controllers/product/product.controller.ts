import { Request, Response } from "express";
import Product from "../../models/product/product.model";
import { doRegex, stringToLowerCase } from "../../utils/formatDate";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, categoryId, images } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ error: 'Product name and category are required.' });
    }

    const normalizedName = stringToLowerCase(name);

    const existingProduct = await Product.findOne({
      name: { $regex: doRegex(normalizedName) },
      categoryId,
    });

    if (existingProduct) {
      return res.status(409).json({ error: 'A product with this name already exists in this category.' });
    }

    const product = new Product({
      name: name.trim(),
      categoryId,
      images,
    });

    const saved = await product.save();
    res.status(201).json(saved);

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate("categoryId");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
