import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})

export const DB_NAME = "budgetwise"

export const OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
};