const mongoose = require("mongoose");

const marketProductSchema = new mongoose.Schema(
  {
    marketId: { type: mongoose.Schema.Types.ObjectId, ref: "Market", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("MarketProduct", marketProductSchema);
 