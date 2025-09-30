import mongoose, { Schema, Document } from 'mongoose';

export interface IMarket extends Document {
  name: string;
  city: string;
  district: string;
}

const MarketSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    lat: { type: Number, required: true},
    lng: { type: Number, required: true},
  },
  { timestamps: true }
);

export default mongoose.model<IMarket>('Market', MarketSchema);
