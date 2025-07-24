const mongoose = require("mongoose");

const marketProductSchema = new mongoose.Schema(
  {
    market: { type: mongoose.Schema.Types.ObjectId, ref: "Market", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MarketProduct", marketProductSchema);
