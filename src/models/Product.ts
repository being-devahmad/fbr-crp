import mongoose, { Schema, Document, model } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: mongoose.Schema.Types.ObjectId | string;
  gstRate: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Category collection
      ref: "Category",
      required: true,
    },
    gstRate: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product =
  mongoose.models.Product || model<IProduct>("Product", productSchema);
export default Product;
