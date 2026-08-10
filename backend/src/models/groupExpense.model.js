import mongoose from "mongoose";

const groupExpenseSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255
        },

        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        },

        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupMember",
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null
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

export const GroupExpense = mongoose.model(
    "GroupExpense",
    groupExpenseSchema
);