const express = require("express");
const router = express.Router();

const Note = require("../models/Note");
const authMiddleware = require("../middleware/authMiddleware");

// Create Note
router.post("/", authMiddleware, async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id
    });

    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Get All Notes (Only Current User)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({
      userId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Update Note (Only Owner Can Update)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found or unauthorized"
      });
    }

    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

// Delete Note (Only Owner Can Delete)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found or unauthorized"
      });
    }

    res.json({
      message: "Note deleted successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;