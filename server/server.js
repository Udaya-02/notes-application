
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./config/db");
const notesRoutes = require("./routes/notes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Notes Application API is running!");
});

// Notes API routes
app.use("/api/notes", notesRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await db.query("SELECT 1");

        console.log("MySQL Database Connected Successfully!");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
