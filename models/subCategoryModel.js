import mongoose from 'mongoose';
import slugify from "slugify";

const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Sub Category is required"],
        trim: true
    },
    thumbnail: String,
    slug: {
        type: String,
        unique: [true, "Slug already taken"],
        trim: true,
        lowercase: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }
}, { timestamps: true })

subCategorySchema.pre('save', async function (next) {
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

export const subCategoryModel = mongoose.model("subCategory", subCategorySchema);