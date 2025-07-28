// slices/matchSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teamA: 0,
  teamB: 0,
  servingTeam: "", // "A" ya da "B"
  serverNumber: "", // 1 ya da 2
  tournamentName: "İstanbul Turnuvası",
  teamAName: "Takım A",
  teamBName: "Takım B",
  setA: 0,
  setB: 0,
  sets: [], // Her biten seti burada saklıyoruz
  createdBy: "", // Admin ID'si
};

const matchSlice = createSlice({
  name: "match",
  initialState,
  reducers: {
    incrementTeamA: (state) => {
      state.teamA += 1;
    },
    incrementTeamB: (state) => {
      state.teamB += 1;
    },
    decrementTeamA: (state) => {
      if (state.teamA > 0) state.teamA -= 1;
    },
    decrementTeamB: (state) => {
      if (state.teamB > 0) state.teamB -= 1;
    },
    resetScores: (state) => {
      state.teamA = 0;
      state.teamB = 0;
    },
    setServingTeam: (state, action) => {
      state.servingTeam = action.payload;
    },
    setServerNumber: (state, action) => {
      state.serverNumber = action.payload;
    },
    setTournamentName: (state, action) => {
      state.tournamentName = action.payload;
    },
    setTeamAName: (state, action) => {
      state.teamAName = action.payload;
    },
    setTeamBName: (state, action) => {
      state.teamBName = action.payload;
    },
    setSetA: (state, action) => {
      state.setA = action.payload;
    },
    setSetB: (state, action) => {
      state.setB = action.payload;
    },
    addSet: (state, action) => {
      state.sets.push(action.payload); // { teamA, teamB, timestamp }
    },
    clearSets: (state) => {
      state.sets = [];
    },
    setCreatedBy: (state, action) => {
      state.createdBy = action.payload;
    },
    setTeamAScore: (state, action) => {
      state.teamA = action.payload;
    },
    setTeamBScore: (state, action) => {
      state.teamB = action.payload;
    },
  },
});

export const {
  incrementTeamA,
  incrementTeamB,
  decrementTeamA,
  decrementTeamB,
  resetScores,
  setServingTeam,
  setServerNumber,
  setTournamentName,
  setTeamAName,
  setTeamBName,
  setSetA,
  setSetB,
  addSet,
  clearSets,
  setCreatedBy,
  setTeamAScore,
  setTeamBScore,
} = matchSlice.actions;

export default matchSlice.reducer;
