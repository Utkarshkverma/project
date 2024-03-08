import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({     // ~ Cors is a cross origin plateform used to connect backend with frontend
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"})) // ~ express.json is used to allow json files in  the request body 
app.use(express.urlencoded( { extended: true,limit : "16kb"} ))
// ~ express.urlencoded is used to understand various  types of data sent by user's browser to server
app.use(express.static("public")) // ~ It is used to make public assests in folder called public
app.use(cookieParser()) // ~ It is used to access and set ccokies of the user from the browser



export {app};