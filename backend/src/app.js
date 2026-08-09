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


// error middleware
app.use(notFound)
app.use(errorHandler)

export { app }