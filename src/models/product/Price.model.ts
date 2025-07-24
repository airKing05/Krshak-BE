import mongoose, { Schema, Document } from 'mongoose';

export interface IPrice extends Document {
  productId: mongoose.Types.ObjectId;
  marketId: mongoose.Types.ObjectId;
  date: Date;
  minPrice: number;
  maxPrice: number;
}

const priceSchema = new Schema<IPrice>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    marketId: { type: Schema.Types.ObjectId, ref: 'Market', required: true },
    date: { type: Date, required: true },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IPrice>('Price', priceSchema);
