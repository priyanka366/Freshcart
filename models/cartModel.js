import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      variant: { type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant", required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },  // Price at the time of adding to cart
    }
  ],
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

export const cartModel = mongoose.model("Cart", cartSchema);
