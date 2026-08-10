import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        },

        date: {
            type: Date,
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
        }
    },
    {
        timestamps: true
    }
);

export const Expense = mongoose.model("Expense", expenseSchema);