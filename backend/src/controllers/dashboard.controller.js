import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Expense } from "../models/expense.model.js";
import { Income } from "../models/income.model.js";
import { Category } from "../models/category.model.js";

const getDashboard = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const expenses = await Expense.find({
        user: userId
    })
    .populate("category", "title")
    .sort({
        date: -1,
        createdAt: -1
    })
    .limit(5);

    const incomes = await Income.find({
        user: userId
    })
    .sort({
        date: -1,
        createdAt: -1
    })
    .limit(5);

    const expenseResult = await Expense.aggregate([
        {
            $match: {
                user: userId
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        }
    ]);

    const incomeResult = await Income.aggregate([
        {
            $match: {
                user: userId
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$amount"
                }
            }
        }
    ]);


    const totalExpense =
        expenseResult.length
            ? expenseResult[0].total
            : 0;


    const totalIncome =
        incomeResult.length
            ? incomeResult[0].total
            : 0;

    const saving =
        Number(totalIncome.toString()) -
        Number(totalExpense.toString());

    const categories = await Category.find({})
        .sort({
            title: 1
        });


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                categories,
                expenses,
                incomes,

                total_expense: totalExpense,
                total_income: totalIncome,

                saving
            },
            "Dashboard data fetched successfully"
        )
    );
});

const getChartData = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const categoryData = await Expense.aggregate([

        {
            $match: {
                user: userId
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
        item => item.title || "Uncategorized"
    );


    const catTotals = categoryData.map(
        item => item.total
    );

    const expensesByDate = await Expense.aggregate([

        {
            $match: {
                user: userId
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


    const lineDates = expensesByDate.map(
        item => item._id
    );


    const lineTotals = expensesByDate.map(
        item => item.total
    );

    const monthlyIncome = await Income.aggregate([

        {
            $match: {
                user: userId
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

    const monthlyExpense = await Expense.aggregate([

        {
            $match: {
                user: userId
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

    const monthSet = new Set();


    monthlyIncome.forEach(item => {
        monthSet.add(item._id);
    });


    monthlyExpense.forEach(item => {
        monthSet.add(item._id);
    });


    const months = Array.from(monthSet).sort();

    const incomeMap = {};
    const expenseMap = {};


    monthlyIncome.forEach(item => {
        incomeMap[item._id] = item.total;
    });


    monthlyExpense.forEach(item => {
        expenseMap[item._id] = item.total;
    });

    const inc = months.map(
        month => incomeMap[month] || 0
    );


    const exp = months.map(
        month => expenseMap[month] || 0
    );


    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                cat_labels: catLabels,
                cat_totals: catTotals,

                line_dates: lineDates,
                line_totals: lineTotals,

                months,

                inc,
                exp
            },
            "Chart data fetched successfully"
        )
    );
});


export {
    getDashboard,
    getChartData
};