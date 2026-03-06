import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({
    path: "./.env"
});

connectDB()
.then(() => {
    app.on("error", (err) => {
        console.error("Server error:", err);
        throw err;        
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT} !!!`);
    }
)})
.catch((err) => {
    console.error("Failed to connect to the database:", err);
})

// importing routes 
import userRoutes from "./routes/user.routes.js";


// using routes
app.use("/api/v1/users", userRoutes)