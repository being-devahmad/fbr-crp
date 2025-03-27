import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["User", "Admin"], // Ensure this is correct
      default: "User",
    },
    image: {
      type: String,
      default:
        "https://png.pngtree.com/png-vector/20190710/ourmid/pngtree-user-vector-avatar-png-image_1541962.jpg",
    },
    permissions: [
      {
        module: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

// Explicitly name the collection to avoid Mongoose cache issues
const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
