// controllers/matchController.js
import Match from "../models/Match.js";

export const saveMatch = async (req, res) => {
  try {
    const newMatch = new Match(req.body);
    const saved = await newMatch.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Kayıt başarısız", details: err.message });
  }
};

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ createdAt: -1 });
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Veriler alınamadı", details: err.message });
  }
};
