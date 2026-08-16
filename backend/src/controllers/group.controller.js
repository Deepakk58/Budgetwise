import crypto from "crypto";

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


        const payerId = expense.paidBy.toString();
        const memberId = split.member.toString();


        if (payerId === memberId) {
            continue;
        }


        const splitAmount = Number(
            split.amount.toString()
        );


        balances[memberId] =
            (balances[memberId] || 0) - splitAmount;


        balances[payerId] =
            (balances[payerId] || 0) + splitAmount;
    }


    for (const settlement of settlements) {

        const paidById = settlement.paidBy.toString();
        const paidToId = settlement.paidTo.toString();


        const amount = Number(
            settlement.amount.toString()
        );


        balances[paidById] =
            (balances[paidById] || 0) + amount;


        balances[paidToId] =
            (balances[paidToId] || 0) - amount;
    }


    return balances;
};


const getGroups = asyncHandler(async (req, res) => {

    const memberships = await GroupMember.find({
        user: req.user._id,
        joined: true
    }).populate("group");


    const groupData = [];


    for (const membership of memberships) {

        const group = membership.group;


        if (!group) {
            continue;
        }


        const members = await GroupMember.find({
            group: group._id
        });


        const balances = await calculateGroupBalances(
            group._id
        );


        const myBalance =
            balances[membership._id.toString()] || 0;


        groupData.push({
            group,
            membersCount: members.length,
            myBalance: Number(myBalance.toFixed(2))
        });
    }


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                groupData,
                "Groups fetched successfully"
            )
        );
});


const createGroup = asyncHandler(async (req, res) => {

    const { name } = req.body;


    if (!name || !name.trim()) {

        throw new ApiError(
            400,
            "Group name is required"
        );
    }


    const group = await Group.create({
        name: name.trim(),
        owner: req.user._id,
        inviteToken: crypto.randomUUID()
    });


    await GroupMember.create({
        group: group._id,
        user: req.user._id,
        name: req.user.username,
        joined: true
    });


    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                group,
                "Group created successfully"
            )
        );
});


const getGroupDetails = asyncHandler(async (req, res) => {

    const { groupId } = req.params;


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
        group: groupId
    }).populate(
        "user",
        "username"
    );


    const expenses = await GroupExpense.find({
        group: groupId
    })
        .populate(
            "paidBy",
            "name user"
        )
        .populate(
            "category",
            "title"
        )
        .sort({
            date: -1,
            createdAt: -1,
            _id: -1
        });


    const expenseIds = expenses.map(
        expense => expense._id
    );


    const splits = await ExpenseSplit.find({
        expense: {
            $in: expenseIds
        }
    }).populate(
        "member",
        "name user"
    );


    const settlements = await Settlement.find({
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


    const balances = await calculateGroupBalances(
        groupId
    );


    const simplifiedTransactions =
        simplifyDebts(balances);


    const formattedBalances = members.map(member => {

        const balance =
            balances[member._id.toString()] || 0;


        return {
            member,
            balance: Number(balance.toFixed(2))
        };
    });


    const formattedExpenses = expenses.map(expense => {

        const expenseSplits = splits.filter(
            split =>
                split.expense.toString() ===
                expense._id.toString()
        );


        return {
            ...expense.toObject(),
            splits: expenseSplits
        };
    });


    const formattedTransactions =
        simplifiedTransactions.map(transaction => {

            const fromMember = members.find(
                member =>
                    member._id.toString() ===
                    transaction.from
            );


            const toMember = members.find(
                member =>
                    member._id.toString() ===
                    transaction.to
            );


            return {
                from: fromMember,
                to: toMember,
                amount: transaction.amount
            };
        });


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    group,
                    members,
                    balances: formattedBalances,
                    expenses: formattedExpenses,
                    transactions: formattedTransactions,
                    settlements
                },
                "Group details fetched successfully"
            )
        );
});


const joinGroup = asyncHandler(async (req, res) => {

    const { token } = req.params;


    const group = await Group.findOne({
        inviteToken: token
    });


    if (!group) {

        throw new ApiError(
            404,
            "Invalid or expired invite link"
        );
    }


    const existingMember = await GroupMember.findOne({
        group: group._id,
        user: req.user._id
    });


    if (existingMember) {

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    existingMember,
                    "You are already a member of this group"
                )
            );
    }


    let member;

    try {
        member = await GroupMember.create({
            group: group._id,
            user: req.user._id,
            name: req.user.username,
            joined: true
        });
    } catch (error) {
        if (error?.code !== 11000) {
            throw error;
        }

        const concurrentMember = await GroupMember.findOne({
            group: group._id,
            user: req.user._id
        });

        if (!concurrentMember) {
            throw error;
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    concurrentMember,
                    "You are already a member of this group"
                )
            );
    }


    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                member,
                "Joined group successfully"
            )
        );
});


const refreshInvite = asyncHandler(async (req, res) => {

    const { groupId } = req.params;


    const group = await Group.findById(groupId);


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
            "Only the group owner can refresh the invite"
        );
    }


    group.inviteToken = crypto.randomUUID();

    await group.save();


    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    inviteToken: group.inviteToken
                },
                "Invite refreshed successfully"
            )
        );
});


export {
    getGroups,
    createGroup,
    getGroupDetails,
    joinGroup,
    refreshInvite
};
