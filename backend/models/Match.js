// models/Match.js
import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    teamAName: String,
    teamBName: String,
    teamA: Number,
    teamB: Number,
    setA: Number,
    setB: Number,
    servingTeam: String,
    serverNumber: Number,
    tournamentName: String,
    sets: [
      {
        teamA: Number,
        teamB: Number,
        timestamp: Date,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

const Match = mongoose.model("Match", matchSchema);
export default Match;
