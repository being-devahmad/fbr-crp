import mongoose, { Schema, Document, model } from "mongoose";

export interface IAccount extends Document {
  name: string;
  code: string;
  contactNumber: string;
  city: string;
  cnic: string;
  branch: string;
  type: "company" | "customer";
}

const accountSchema = new Schema<IAccount>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      match: /^ACC-\d{4}$/,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
      match: /^\d{5}-\d{7}-\d{1}$/,
    },
    contactNumber: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["company", "customer"],
      required: true,
    },
  },
  { timestamps: true }
);

const Account =
  mongoose.models.Account || model<IAccount>("Account", accountSchema);
export default Account;
