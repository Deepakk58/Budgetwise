import mongoose from "mongoose";
import crypto from "crypto";

const groupSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        inviteToken: {
            type: String,
            default: () => crypto.randomUUID(),
            unique: true,
            immutable: true
        }
    },
    {
        timestamps: true
    }
);

export const Group = mongoose.model("Group", groupSchema);