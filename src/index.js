import dotenv from "dotenv";
import connectDB from "./db/db.js";
import app from "./app.js";

dotenv.config({
    path: "../env"
});

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 4040, () => {
            console.log(`App is listening Port: ${process.env.PORT || 4040}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Error: ", error);
    });
