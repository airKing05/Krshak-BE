import express from "express";
import * as marketCtrl from "../../controllers/product/market.controller";
import * as categoryCtrl from "../../controllers/product/category.controller";
import * as productCtrl from "../../controllers/product/product.controller";
import * as marketCategoryCtrl from "../../controllers/product/marketCategory.controller";
import * as marketProductCtrl from "../../controllers/product/marketProduct.controller";
import * as priceCtrl from "../../controllers/product/price.controller";


const router = express.Router();

// Markets
router.post("/markets", marketCtrl.createMarket);
router.get("/markets", marketCtrl.getAllMarkets);
router.get('/:marketId/categories', marketCtrl.getMarketCategories); // list of categories
router.get('/:marketId/categories', marketCtrl.getProductsByMarketAndCategory); // list of products


// Categories
router.post("/categories", categoryCtrl.createCategory);
router.get("/categories", categoryCtrl.getAllCategories);

// Products
router.post("/products", productCtrl.createProduct);
router.get("/products", productCtrl.getAllProducts);

// price
router.post("/prices", priceCtrl.createPrice);
router.get("/prices/:productId", priceCtrl.getPricesByProduct);

// Market-Category
router.post("/market-categories", marketCategoryCtrl.linkMarketCategory);
router.get("/market-categories", marketCategoryCtrl.getMarketCategories);

// Market-Product
router.post("/market-products", marketProductCtrl.linkMarketProduct);
router.get("/market-products", marketProductCtrl.getMarketProducts);

export default router;
