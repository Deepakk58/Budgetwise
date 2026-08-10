import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },

        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupMember",
            required: true
        },

        paidTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GroupMember",
            required: true
        },

        amount: {
            type: mongoose.Schema.Types.Decimal128,
            required: true
        },

        date: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

export const Settlement = mongoose.model(
    "Settlement",
    settlementSchema
);