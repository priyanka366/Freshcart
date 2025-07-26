import mongoose from "mongoose";
import slugify from "slugify";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is requied"],
        trim: true
    },
    thumbnail: String,
    slug: {
        type: String,
        unique: [true, "Slug already taken"],
        trim: true,
        lowercase: true,
    },
}, { timestamps: true });

categorySchema.pre('save', async function(next){
    if(this.name){
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

export const categoryModel = mongoose.model("Category", categorySchema);