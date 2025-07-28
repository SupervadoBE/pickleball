// app.js
import express from "express";
import cors from "cors";
import matchRoutes from "./routes/matchRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ Admin route eklendi

const app = express();

app.use(cors());
app.use(express.json());

// Route'lar
app.use("/api/match", matchRoutes);
app.use("/api/admin", adminRoutes); // ✅ Admin route aktif

app.get("/", (req, res) => {
  res.send("API Çalışıyor 🚀");
});

export default app;
