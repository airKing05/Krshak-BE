import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  images: string[];
}

const MIN_IMAGES = 1;
const MAX_IMAGES = 5;

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    images: {
      type: [String],
      required: true,
      validate: [
        {
          validator: function (value: string[]) {
            return value.length >= MIN_IMAGES && value.length <= MAX_IMAGES;
          },
          message: `Images array must contain between ${MIN_IMAGES} and ${MAX_IMAGES} items.`,
        },
        {
          validator: function (value: string[]) {
            return value.every((url) =>
              /^(https?:\/\/.*\.(?:png|jpg|jpeg|webp|gif|svg))$/i.test(url)
            );
          },
          message: 'Each image must be a valid image URL.',
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
