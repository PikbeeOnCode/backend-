import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// importing routes 
import userRoutes from "./routes/user.routes.js";
import videoRoutes from "./routes/video.routes.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use(express.static("public"));

app.use(cookieParser());


// using routes
app.use("/api/v1/users", userRoutes)
app.use("/api/v1/videos", videoRoutes)


export {app };