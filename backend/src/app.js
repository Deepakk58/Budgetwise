import dotenv from "dotenv"
import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./middlewares/error.middleware.js"
import notFound from "./middlewares/notFound.middleware.js"

dotenv.config({
    path: './.env'
})

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,    
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 
import userRouter from "./routes/user.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js";
import expenseRouter from "./routes/expense.routes.js";
import incomeRouter from "./routes/income.routes.js";
import budgetRouter from "./routes/budget.routes.js";
import groupRouter from "./routes/group.routes.js"
import groupExpenseRouter from "./routes/groupExpense.routes.js"
import settlementRouter from "./routes/settlement.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/incomes", incomeRouter);
app.use("/api/v1/budgets", budgetRouter);
app.use("/api/v1/groups", groupRouter);
app.use("/api/v1/group-expenses", groupExpenseRouter);
app.use("/api/v1/settlements", settlementRouter);

// error middleware
app.use(notFound)
app.use(errorHandler)

export { app }