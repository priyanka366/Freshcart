import mongoose from "mongoose";
import slugify from "slugify";

const ratingsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, ref: 'User'
        },
        rating: {
            type: Number,
            min: 1, 
            max: 5
        },
        review: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    { _id: false }
);

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name can not be empty.'],
        trim: true
    },
    slug: {
        type: String,
        // required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    shortDesc: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory'
    },
    brand: {
        type: String,
        trim: true
    },
    ratings: [ratingsSchema],
    isFeatured: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    attributes: {
        type: Map,
        of: String
    }, // Generic product attributes (e.g., material, battery life)
    variants: [{ type: mongoose.Schema.Types.ObjectId, ref: "ProductVariant" }],
    thumbnail: { type: String, trim: true }, // ✅ Main product thumbnail
}, { timestamps: true });

productSchema.pre('save', async function (next) {
    if (this.name) {
        let baseSlug = slugify(this.name, { lower: true, strict: true });
        let slug = baseSlug;
        let count = 1;

        // Check for existing slug and generate a unique one
        while (await this.constructor.exists({ slug })) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        this.slug = slug;
    }
    next();
});

export const productModel = mongoose.model("Product", productSchema);