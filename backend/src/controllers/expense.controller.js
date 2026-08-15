import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Expense } from "../models/expense.model.js";
import { Category } from "../models/category.model.js";

const getExpenses = asyncHandler(async (req, res) => {

    const expenses = await Expense.find({
        user: req.user._id
    })
    .populate("category", "title")
    .sort({
        date: -1,
        createdAt: -1
    });

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            expenses,
            "Expenses fetched successfully"
        )
    );
});

const getRecentExpenses = asyncHandler(async (req, res) => {

    const expenses = await Expense.find({
        user: req.user._id
    })
    .populate("category", "title")
    .sort({
        date: -1,
        createdAt: -1
    })
    .limit(5);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            expenses,
            "Recent expenses fetched successfully"
        )
    );
});

const getTotalExpense = asyncHandler(async (req, res) => {

    const result = await Expense.aggregate([
        {
            $match: {
                user: req.user._id
            }
        },
        {
            $group: {
                _id: null,
                totalExpense: {
                    $sum: "$amount"
                }
            }
        }
    ]);

    const totalExpense =
        result.length > 0
            ? result[0].totalExpense
            : 0;

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                total_expense: totalExpense
            },
            "Total expense fetched successfully"
        )
    );
});

const addExpense = asyncHandler(async (req, res) => {

    const {
        name,
        amount,
        category,
        date
    } = req.body;


    if (
        [name, amount, category, date]
        .some((field) => field === undefined || field === null || field === "")
    ) {
        throw new ApiError(
            400,
            "Name, amount, category and date are required"
        );
    }


    const parsedAmount = Number(amount);

    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
        throw new ApiError(
            400,
            "Amount must be a valid positive number"
        );
    }


    const existingCategory = await Category.findOne({
        title: category.trim()
    });


    if (!existingCategory) {
        throw new ApiError(
            404,
            "Category not found"
        );
    }


    const expense = await Expense.create({
        user: req.user._id,
        name: name.trim(),
        amount: parsedAmount,
        category: existingCategory._id,
        date
    });


    const createdExpense = await Expense.findById(expense._id)
        .populate("category", "title");


    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            createdExpense,
            "Expense added successfully"
        )
    );
});

const editExpense = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const {
        name,
        amount,
        category,
        date
    } = req.body;


    const expense = await Expense.findOne({
        _id: id,
        user: req.user._id
    });


    if (!expense) {
        throw new ApiError(
            404,
            "Expense not found"
        );
    }


    if (amount !== undefined) {

        const parsedAmount = Number(amount);

        if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
            throw new ApiError(
                400,
                "Amount must be a valid positive number"
            );
        }

        expense.amount = parsedAmount;
    }


    if (name !== undefined) {
        expense.name = name.trim();
    }


    if (date !== undefined) {
        expense.date = date;
    }


    if (category !== undefined) {

        const existingCategory = await Category.findOne({
            title: category.trim()
        });


        if (!existingCategory) {
            throw new ApiError(
                404,
                "Category not found"
            );
        }


        expense.category = existingCategory._id;
    }


    await expense.save();


    const updatedExpense = await Expense.findById(expense._id)
        .populate("category", "title");


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedExpense,
            "Expense updated successfully"
        )
    );
});

const deleteExpense = asyncHandler(async (req, res) => {

    const { id } = req.params;


    const expense = await Expense.findOne({
        _id: id,
        user: req.user._id
    });


    if (!expense) {
        throw new ApiError(
            404,
            "Expense not found"
        );
    }


    await Expense.deleteOne({
        _id: expense._id
    });


    const size = await Expense.countDocuments({
        user: req.user._id
    });


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                size
            },
            "Expense removed successfully"
        )
    );
});

const getExpenseData = asyncHandler(async (req, res) => {

    const categoryData = await Expense.aggregate([
        {
            $match: {
                user: req.user._id
            }
        },
        {
            $group: {
                _id: "$category",
                total: {
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
                title: "$category.title",
                total: 1
            }
        }
    ]);


    const catLabels = categoryData.map(
        (item) => item.title || "Uncategorized"
    );


    const catTotals = categoryData.map(
        (item) => item.total
    );

    const expensesByDate = await Expense.aggregate([
        {
            $match: {
                user: req.user._id
            }
        },
        {
            $group: {
                _id: "$date",
                total: {
                    $sum: "$amount"
                }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ]);


    const dates = expensesByDate.map(
        (item) => item._id
    );


    const totals = expensesByDate.map(
        (item) => item.total
    );


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                cat_labels: catLabels,
                cat_totals: catTotals,
                line_dates: dates,
                line_totals: totals
            },
            "Expense data fetched successfully"
        )
    );
});


export {
    getExpenses,
    getRecentExpenses,
    getTotalExpense,
    addExpense,
    editExpense,
    deleteExpense,
    getExpenseData
};