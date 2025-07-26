import mongoose from "mongoose";
const productVariantSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    color: { type: String, trim: true },
    size: { type: String, trim: true },
    weight: { type: String, trim: true },
    stock: { type: Number, default: 0 },
    price: { type: Number, required: true },
    thumbnail: { type: String, trim: true }, // ✅ Thumbnail for each variant
    photos: [{ type: String, trim: true }] // ✅ Multiple images for the variant
});

export const ProductVariant = mongoose.model('ProductVariant', productVariantSchema);
