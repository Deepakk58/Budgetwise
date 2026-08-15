import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Income } from "../models/income.model.js";

const getIncomes = asyncHandler(async (req, res) => {

    const incomes = await Income.find({
        user: req.user._id
    })
    .sort({
        date: -1,
        createdAt: -1
    });


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            incomes,
            "Incomes fetched successfully"
        )
    );
});

const getRecentIncomes = asyncHandler(async (req, res) => {

    const incomes = await Income.find({
        user: req.user._id
    })
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
            incomes,
            "Recent incomes fetched successfully"
        )
    );
});

const getTotalIncome = asyncHandler(async (req, res) => {

    const result = await Income.aggregate([
        {
            $match: {
                user: req.user._id
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: {
                    $sum: "$amount"
                }
            }
        }
    ]);


    const totalIncome =
        result.length > 0
            ? result[0].totalIncome
            : 0;


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                total_income: totalIncome
            },
            "Total income fetched successfully"
        )
    );
});

const addIncome = asyncHandler(async (req, res) => {

    const {
        name,
        amount,
        date
    } = req.body;


    if (
        [name, amount, date]
        .some((field) => field === undefined || field === null || field === "")
    ) {
        throw new ApiError(
            400,
            "Name, amount and date are required"
        );
    }


    const parsedAmount = Number(amount);


    if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
        throw new ApiError(
            400,
            "Amount must be a valid positive number"
        );
    }


    const income = await Income.create({
        user: req.user._id,
        name: name.trim(),
        amount: parsedAmount,
        date
    });


    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            income,
            "Income added successfully"
        )
    );
});

const editIncome = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const {
        name,
        amount,
        date
    } = req.body;


    const income = await Income.findOne({
        _id: id,
        user: req.user._id
    });


    if (!income) {
        throw new ApiError(
            404,
            "Income not found"
        );
    }


    if (name !== undefined) {
        income.name = name.trim();
    }


    if (date !== undefined) {
        income.date = date;
    }


    if (amount !== undefined) {

        const parsedAmount = Number(amount);


        if (Number.isNaN(parsedAmount) || parsedAmount < 0) {
            throw new ApiError(
                400,
                "Amount must be a valid positive number"
            );
        }


        income.amount = parsedAmount;
    }


    await income.save();


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            income,
            "Income updated successfully"
        )
    );
});

const deleteIncome = asyncHandler(async (req, res) => {

    const { id } = req.params;


    const income = await Income.findOne({
        _id: id,
        user: req.user._id
    });


    if (!income) {
        throw new ApiError(
            404,
            "Income not found"
        );
    }


    await Income.deleteOne({
        _id: income._id
    });


    const size = await Income.countDocuments({
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
            "Income removed successfully"
        )
    );
});

const getMonthlyIncomeData = asyncHandler(async (req, res) => {

    const monthlyData = await Income.aggregate([
        {
            $match: {
                user: req.user._id
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m",
                        date: "$date"
                    }
                },
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


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            monthlyData,
            "Monthly income data fetched successfully"
        )
    );
});


export {
    getIncomes,
    getRecentIncomes,
    getTotalIncome,
    addIncome,
    editIncome,
    deleteIncome,
    getMonthlyIncomeData
};