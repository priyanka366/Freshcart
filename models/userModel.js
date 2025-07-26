import mongoose from "mongoose";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

const addressSchema = new mongoose.Schema(
    {
        street: {
            type: String,
            required: [true, "Street is required"],
        },
        landmark: {
            type: String,
            required: [true, "Landmark is required"],
        },
        city: {
            type: String,
            required: [true, "City is required"],
        },
        country: {
            type: String,
            required: [true, "Country is required"],
        },
        postalCode: {
            type: String,
            required: [true, "Postal code is required"],
        },
        addressType: {
            type: String,
            enum: ["home", "office", "work", "other"],
            required: [true, "Address type is required"],
        },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Email is required"],
        unique: [true, "Email already taken"],
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        minLength: [6, "Password length should be greater than 6 characters"],
    },
    refreshToken: {
        type: String,
        default: null,
    },
    addresses: [addressSchema],
    city: {
        type: String,
        required: [true, "City is required"],
    },
    country: {
        type: String,
        required: [true, "Country is required"],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^\d{10}$/, "Please enter a valid phone number"],
    },
    profilePic: {
        public_id: String,
        url: String,
    },
    role: {
        type: String,
        enum: ["admin", "user", "editor"],
        default: "user",
    },

}, { timestamps: true });

// Pre-save hook to hash password if modified
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Compare plain text password with hashed password
userSchema.methods.comparePassword = async function (plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};



// Generate a JWT access token
userSchema.methods.generateAccessToken = function () {
    return JWT.sign({ _id: this.id }, process.env.JWT_SECRET, {
        expiresIn: "30m",
    });
};

// Generate a JWT refresh token
userSchema.methods.generateRefreshToken = async function () {
    const refreshToken = JWT.sign({ _id: this.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    this.refreshToken = refreshToken;
    await this.save();
    return refreshToken;
};

export const userModel = mongoose.model('Users', userSchema);