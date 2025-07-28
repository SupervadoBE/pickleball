import express from "express";
import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

const router = express.Router();

// Giriş
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: "Geçersiz email veya şifre" });
  }
});

// Kayıt
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    return res.status(400).json({ message: "Admin zaten kayıtlı" });
  }

  const admin = await Admin.create({ name, email, password });
  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400).json({ message: "Geçersiz admin verisi" });
  }
});

export default router;
