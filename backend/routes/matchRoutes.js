import express from "express";
import Match from "../models/Match.js";

const router = express.Router();

// Belirli bir maçı ID ile getir (hakem bilgisi dahil)
router.get("/:id", async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (match) {
      res.json(match);
    } else {
      res.status(404).json({ message: "Maç bulunamadı" });
    }
  } catch (error) {
    console.error("Maç getirme hatası:", error);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// GET: Tüm maçları getir
router.get("/", async (req, res) => {
  try {
    const matches = await Match.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Maçlar alınamadı", error: err.message });
  }
});

// POST: Yeni maç kaydet
router.post("/", async (req, res) => {
  try {
    const newMatch = new Match(req.body);
    await newMatch.save();
    res.status(201).json({ message: "Maç başarıyla kaydedildi." });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    res.status(500).json({ message: "Kayıt başarısız." });
  }
});

// DELETE: Maç sil
router.delete("/:id", async (req, res) => {
  try {
    const deletedMatch = await Match.findByIdAndDelete(req.params.id);
    if (!deletedMatch) {
      return res.status(404).json({ message: "Maç bulunamadı" });
    }
    res.json({ message: "Maç silindi" });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

export default router;
