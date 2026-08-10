import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
            required: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 255
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: null
        },

        joined: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const GroupMember = mongoose.model(
    "GroupMember",
    groupMemberSchema
);