import express from "express";
import * as marketCtrl from "../../controllers/product/market.controller";
import * as categoryCtrl from "../../controllers/product/category.controller";
import * as productCtrl from "../../controllers/product/product.controller";
import * as marketCategoryCtrl from "../../controllers/product/marketCategory.controller";
import * as marketProductCtrl from "../../controllers/product/marketProduct.controller";
import * as priceCtrl from "../../controllers/product/price.controller";
import * as comparePriceCtrl from "../../controllers/product/comparePrices.controller";



const router = express.Router();

// Markets
router.post("/markets", marketCtrl.createMarket);
router.get("/markets", marketCtrl.getAllMarkets);

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
router.get('/market-categories/:marketId/categories', marketCategoryCtrl.getCategoriesByMarketId); // list of categories of selected marketId

// Market-Product
router.post("/market-products", marketProductCtrl.linkMarketProduct);
router.get("/market-products", marketProductCtrl.getMarketProducts);
router.get('/market-products/:marketId', marketProductCtrl.getProductsByMarketAndCategory); // list of products of selected marketId & productId
router.get("/market-products/:marketId/product/:productId", marketProductCtrl.getSingleProductDetail); // get full details of product with price history by marketId and productId

//priceComparisonRoutes.js
router.get("/compare-price", comparePriceCtrl.comparePrices);

export default router;
