import mongoose from "mongoose";
import { model } from "mongoose";
import { Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // Optional: Prevent duplicate categories
    },
  },
  { timestamps: true }
);

const Category =
  mongoose.models.Category || model<ICategory>("Category", categorySchema);
export default Category;
