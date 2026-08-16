import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import { GroupExpense } from "../models/groupExpense.model.js";
import { ExpenseSplit } from "../models/expenseSplit.model.js";


const addGroupExpense = asyncHandler(async (req, res) => {

    const { groupId } = req.params;

    const {
        title,
        amount,
        paidBy,
        date,
        splitType,
        participants
    } = req.body;


    if (!title || !title.trim()) {
        throw new ApiError(
            400,
            "Expense title is required"
        );
    }


    if (
        amount === undefined ||
        amount === null ||
        amount === ""
    ) {
        throw new ApiError(
            400,
            "Expense amount is required"
        );
    }


    const parsedAmount = Number(amount);


    if (
        !Number.isFinite(parsedAmount) ||
        parsedAmount <= 0
    ) {
        throw new ApiError(
            400,
            "Amount must be a valid positive number"
        );
    }


    if (!paidBy) {
        throw new ApiError(
            400,
            "Paid by member is required"
        );
    }


    if (!date) {
        throw new ApiError(
            400,
            "Expense date is required"
        );
    }


    if (!splitType) {
        throw new ApiError(
            400,
            "Split type is required"
        );
    }


    if (!Array.isArray(participants) || participants.length === 0) {
        throw new ApiError(
            400,
            "At least one participant is required"
        );
    }


    const group = await Group.findById(groupId);


    if (!group) {
        throw new ApiError(
            404,
            "Group not found"
        );
    }


    const currentMember = await GroupMember.findOne({
        group: groupId,
        user: req.user._id,
        joined: true
    });


    if (!currentMember) {
        throw new ApiError(
            403,
            "You are not a member of this group"
        );
    }


    const members = await GroupMember.find({
        _id: {
            $in: participants
        },
        group: groupId
    });


    if (members.length !== participants.length) {
        throw new ApiError(
            400,
            "Invalid participant"
        );
    }


    const payer = await GroupMember.findOne({
        _id: paidBy,
        group: groupId
    });


    if (!payer) {
        throw new ApiError(
            400,
            "Invalid payer"
        );
    }


    const splits = {};


    if (splitType === "equal") {

        const splitAmount =
            parsedAmount / members.length;


        for (const member of members) {

            splits[member._id.toString()] =
                splitAmount;
        }
    }


    else if (splitType === "exact") {

        const splitAmounts =
            req.body.splitAmounts;


        if (
            !splitAmounts ||
            typeof splitAmounts !== "object"
        ) {
            throw new ApiError(
                400,
                "Split amounts are required"
            );
        }


        let total = 0;


        for (const member of members) {

            const memberId =
                member._id.toString();

            const value =
                Number(splitAmounts[memberId] || 0);


            if (
                !Number.isFinite(value) ||
                value < 0
            ) {
                throw new ApiError(
                    400,
                    "Invalid split amount"
                );
            }


            splits[memberId] = value;

            total += value;
        }


        if (
            Math.abs(total - parsedAmount) > 0.01
        ) {
            throw new ApiError(
                400,
                "Split amounts must equal total amount"
            );
        }
    }


    else if (splitType === "percent") {

        const percentages =
            req.body.percentages;


        if (
            !percentages ||
            typeof percentages !== "object"
        ) {
            throw new ApiError(
                400,
                "Percentages are required"
            );
        }


        let totalPercent = 0;


        for (const member of members) {

            const memberId =
                member._id.toString();

            const percent =
                Number(percentages[memberId] || 0);


            if (
                !Number.isFinite(percent) ||
                percent < 0
            ) {
                throw new ApiError(
                    400,
                    "Invalid percentage"
                );
            }


            totalPercent += percent;
        }


        if (totalPercent <= 0) {
            throw new ApiError(
                400,
                "Total percentage must be greater than zero"
            );
        }


        for (const member of members) {

            const memberId =
                member._id.toString();

            const percent =
                Number(percentages[memberId] || 0);


            splits[memberId] =
                (percent / totalPercent) *
                parsedAmount;
        }
    }


    else {

        throw new ApiError(
            400,
            "Invalid split type"
        );
    }


    const expense = await GroupExpense.create({
        group: groupId,
        title: title.trim(),
        amount: parsedAmount,
        paidBy: paidBy,
        date: new Date(date)
    });


    const splitDocuments = [];


    for (const member of members) {

        const memberId =
            member._id.toString();

        const splitAmount =
            splits[memberId];


        if (splitAmount < 0) {
            continue;
        }


        splitDocuments.push({
            expense: expense._id,
            member: member._id,
            amount: Number(
                splitAmount.toFixed(2)
            )
        });
    }


    await ExpenseSplit.insertMany(
        splitDocuments
    );


    const createdExpense =
        await GroupExpense.findById(
            expense._id
        )
        .populate(
            "paidBy",
            "name user"
        );


    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {
                    expense: createdExpense,
                    splits: splitDocuments
                },
                "Group expense added successfully"
            )
        );
});


const deleteGroupExpense = asyncHandler(async (req, res) => {

    const { expenseId } = req.params;


    const expense =
        await GroupExpense.findById(
            expenseId
        );


    if (!expense) {
        throw new ApiError(
            404,
            "Expense not found"
        );
    }


    const group =
        await Group.findById(
            expense.group
        );


    if (!group) {
        throw new ApiError(
            404,
            "Group not found"
        );
    }


    if (
        group.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "Only the group owner can delete an expense"
        );
    }


    await ExpenseSplit.deleteMany({
        expense: expense._id
    });


    await GroupExpense.deleteOne({
        _id: expense._id
    });


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Group expense deleted successfully"
            )
        );
});


export {
    addGroupExpense,
    deleteGroupExpense
};
