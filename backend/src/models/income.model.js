import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
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
        }
    },
    {
        timestamps: true
    }
);

export const Income = mongoose.model("Income", incomeSchema);