import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { simplifyDebts } from "../utils/debtSimplification.js";

import { Group } from "../models/group.model.js";
import { GroupMember } from "../models/groupMember.model.js";
import { GroupExpense } from "../models/groupExpense.model.js";
import { ExpenseSplit } from "../models/expenseSplit.model.js";
import { Settlement } from "../models/settlement.model.js";


const calculateGroupBalances = async (groupId) => {

    const balances = {};


    const expenses = await GroupExpense.find({
        group: groupId
    });


    const expenseIds = expenses.map(
        expense => expense._id
    );


    const splits = await ExpenseSplit.find({
        expense: {
            $in: expenseIds
        }
    });


    const settlements = await Settlement.find({
        group: groupId
    });


    for (const split of splits) {

        const expense = expenses.find(
            expense =>
                expense._id.toString() ===
                split.expense.toString()
        );


        if (!expense) {
            continue;
        }


        const payerId =
            expense.paidBy.toString();

        const memberId =
            split.member.toString();


        if (payerId === memberId) {
            continue;
        }


        const amount =
            Number(split.amount.toString());


        balances[memberId] =
            (balances[memberId] || 0) - amount;


        balances[payerId] =
            (balances[payerId] || 0) + amount;
    }


    for (const settlement of settlements) {

        const paidById =
            settlement.paidBy.toString();

        const paidToId =
            settlement.paidTo.toString();

        const amount =
            Number(settlement.amount.toString());


        balances[paidById] =
            (balances[paidById] || 0) + amount;


        balances[paidToId] =
            (balances[paidToId] || 0) - amount;
    }


    return balances;
};


const getSettlementSuggestions = asyncHandler(
    async (req, res) => {

        const { groupId } = req.params;


        const group =
            await Group.findById(groupId);


        if (!group) {

            throw new ApiError(
                404,
                "Group not found"
            );
        }


        const currentMember =
            await GroupMember.findOne({
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


        const members =
            await GroupMember.find({
                group: groupId
            });


        const balances =
            await calculateGroupBalances(groupId);

        for (const member of members) {
            const memberId = member._id.toString();
            balances[memberId] ??= 0;
        }


        const transactions =
            simplifyDebts(balances);


        const formattedTransactions =
            transactions.map(transaction => {

                const from =
                    members.find(
                        member =>
                            member._id.toString() ===
                            transaction.from
                    );


                const to =
                    members.find(
                        member =>
                            member._id.toString() ===
                            transaction.to
                    );


                return {
                    from,
                    to,
                    amount: transaction.amount
                };
            });


        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    formattedTransactions,
                    "Settlement suggestions fetched successfully"
                )
            );
    }
);


const createSettlement = asyncHandler(
    async (req, res) => {

        const { groupId } = req.params;

        const {
            paidBy,
            paidTo,
            amount
        } = req.body;


        if (!paidBy || !paidTo) {

            throw new ApiError(
                400,
                "Payer and receiver are required"
            );
        }


        if (paidBy === paidTo) {

            throw new ApiError(
                400,
                "Payer and receiver must be different"
            );
        }


        if (
            amount === undefined ||
            amount === null ||
            amount === ""
        ) {

            throw new ApiError(
                400,
                "Settlement amount is required"
            );
        }


        const parsedAmount =
            Number(amount);


        if (
            !Number.isFinite(parsedAmount) ||
            parsedAmount <= 0
        ) {

            throw new ApiError(
                400,
                "Amount must be a valid positive number"
            );
        }


        const group =
            await Group.findById(groupId);


        if (!group) {

            throw new ApiError(
                404,
                "Group not found"
            );
        }


        const currentMember =
            await GroupMember.findOne({
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


        const payer =
            await GroupMember.findOne({
                _id: paidBy,
                group: groupId
            });


        const receiver =
            await GroupMember.findOne({
                _id: paidTo,
                group: groupId
            });


        if (!payer || !receiver) {

            throw new ApiError(
                400,
                "Invalid payer or receiver"
            );
        }


        const settlement =
            await Settlement.create({
                group: groupId,
                paidBy: paidBy,
                paidTo: paidTo,
                amount: parsedAmount
            });


        const createdSettlement =
            await Settlement.findById(
                settlement._id
            )
            .populate(
                "paidBy",
                "name user"
            )
            .populate(
                "paidTo",
                "name user"
            );


        return res
            .status(201)
            .json(
                new ApiResponse(
                    201,
                    createdSettlement,
                    "Settlement recorded successfully"
                )
            );
    }
);


const getSettlementHistory = asyncHandler(
    async (req, res) => {

        const { groupId } = req.params;


        const group =
            await Group.findById(groupId);


        if (!group) {

            throw new ApiError(
                404,
                "Group not found"
            );
        }


        const currentMember =
            await GroupMember.findOne({
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


        const settlements =
            await Settlement.find({
                group: groupId
            })
            .populate(
                "paidBy",
                "name user"
            )
            .populate(
                "paidTo",
                "name user"
            )
            .sort({
                date: -1,
                createdAt: -1,
                _id: -1
            });


        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    settlements,
                    "Settlement history fetched successfully"
                )
            );
    }
);


export {
    getSettlementSuggestions,
    createSettlement,
    getSettlementHistory
};
