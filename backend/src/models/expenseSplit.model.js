import mongoose from "mongoose";

const expenseSplitSchema = new mongoose.Schema(
    {
        expense: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupExpense",
            required: true
        },

        member: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupMember",
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

export const ExpenseSplit = mongoose.model(
    "ExpenseSplit",
    expenseSplitSchema
);