
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Validate note ID
function validId(id) {
    return Number.isInteger(Number(id)) && Number(id) > 0;
}

// GET all notes and search notes
router.get("/", async (req, res) => {
    try {
        const search = (req.query.search || "").trim();

        const [notes] = await db.execute(
            `SELECT * FROM notes
             WHERE title LIKE ? OR content LIKE ?
             ORDER BY updated_at DESC`,
            [`%${search}%`, `%${search}%`]
        );

        res.json({
            success: true,
            data: notes
        });
    } catch (error) {
        console.error("Fetch error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch notes."
        });
    }
});

// CREATE a new note
router.post("/", async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required."
            });
        }

        const [result] = await db.execute(
            "INSERT INTO notes (title, content) VALUES (?, ?)",
            [title.trim(), content.trim()]
        );

        const [notes] = await db.execute(
            "SELECT * FROM notes WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Note created successfully.",
            data: notes[0]
        });
    } catch (error) {
        console.error("Create error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to create note."
        });
    }
});

// UPDATE an existing note
router.put("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { title, content } = req.body;

        if (!validId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID."
            });
        }

        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({
                success: false,
                message: "Title and content are required."
            });
        }

        const [result] = await db.execute(
            "UPDATE notes SET title = ?, content = ? WHERE id = ?",
            [title.trim(), content.trim(), id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        const [notes] = await db.execute(
            "SELECT * FROM notes WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Note updated successfully.",
            data: notes[0]
        });
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to update note."
        });
    }
});

// DELETE a note
router.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        if (!validId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid note ID."
            });
        }

        const [result] = await db.execute(
            "DELETE FROM notes WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Note not found."
            });
        }

        res.json({
            success: true,
            message: "Note deleted successfully."
        });
    } catch (error) {
        console.error("Delete error:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to delete note."
        });
    }
});

module.exports = router;
