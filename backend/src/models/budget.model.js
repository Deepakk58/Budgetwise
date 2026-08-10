import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Budget = mongoose.model("Budget", budgetSchema);