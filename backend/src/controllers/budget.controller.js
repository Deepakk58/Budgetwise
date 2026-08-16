import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Budget } from "../models/budget.model.js";
import { Category } from "../models/category.model.js";
import { Expense } from "../models/expense.model.js";

const getBudgets = asyncHandler(async (req, res) => {

    const budgets = await Budget.find({
        user: req.user._id
    })
    .populate("category", "title")
    .sort({
        createdAt: -1
    });


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            budgets,
            "Budgets fetched successfully"
        )
    );
});

const getCategories = asyncHandler(async (req, res) => {

    const categories = await Category.find({});

    categories.sort((left, right) => {
        const leftIsOther = left.title.trim().toLowerCase() === "other";
        const rightIsOther = right.title.trim().toLowerCase() === "other";

        if (leftIsOther !== rightIsOther) {
            return leftIsOther ? 1 : -1;
        }

        return left.title.localeCompare(right.title);
    });


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            categories,
            "Categories fetched successfully"
        )
    );
});

const getCurrentMonthBudgetData = asyncHandler(async (req, res) => {

    const now = new Date();

    const startOfMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
    );


    const startOfNextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        1
    );


    const expenses = await Expense.aggregate([

        {
            $match: {
                user: req.user._id,

                date: {
                    $gte: startOfMonth,
                    $lt: startOfNextMonth
                }
            }
        },

        {
            $group: {
                _id: "$category",

                total_amount: {
                    $sum: "$amount"
                }
            }
        },

        {
            $lookup: {
                from: "categories",

                localField: "_id",

                foreignField: "_id",

                as: "category"
            }
        },

        {
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $project: {
                _id: 0,

                categoryId: "$_id",

                category: "$category.title",

                total_amount: 1
            }
        }
    ]);

    const expensesDict = {};


    for (const expense of expenses) {

        const categoryName =
            expense.category || "Uncategorized";


        expensesDict[categoryName] =
            expense.total_amount;
    }


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                expenses: expensesDict
            },
            "Current month budget data fetched successfully"
        )
    );
});

const setMultipleBudgets = asyncHandler(async (req, res) => {

    const { budgets } = req.body;


    if (!Array.isArray(budgets)) {
        throw new ApiError(
            400,
            "budgets must be an array"
        );
    }


    const operations = [];


    for (const item of budgets) {

        const {
            category,
            amount
        } = item;


        if (!category || amount === undefined) {
            throw new ApiError(
                400,
                "Category and amount are required"
            );
        }


        const parsedAmount = Number(amount);


        if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
            throw new ApiError(
                400,
                "Invalid budget amount"
            );
        }


        operations.push({
            updateOne: {
                filter: {
                    user: req.user._id,
                    category
                },

                update: {
                    $set: {
                        amount: parsedAmount
                    }
                },

                upsert: true
            }
        });
    }


    if (operations.length > 0) {
        await Budget.bulkWrite(operations);
    }


    const updatedBudgets = await Budget.find({
        user: req.user._id
    })
    .populate("category", "title");


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedBudgets,
            "Budgets updated successfully"
        )
    );
});

export {
    getBudgets,
    getCategories,
    getCurrentMonthBudgetData,
    setMultipleBudgets
};
