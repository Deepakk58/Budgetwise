import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            maxlength: 100
        }
    },
    {
        timestamps: true
    }
);

export const Category = mongoose.model("Category", categorySchema);