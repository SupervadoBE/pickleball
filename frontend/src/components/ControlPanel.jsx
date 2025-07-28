// components/ControlPanel.jsx
import socket from "../socket";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  incrementTeamA,
  incrementTeamB,
  resetScores,
  decrementTeamA,
  decrementTeamB,
  setServingTeam,
  setServerNumber,
  setTeamAName,
  setTeamBName,
  setTournamentName,
  setSetA,
  setSetB,
  addSet,
  clearSets,
  setCreatedBy,
} from "../slices/matchSlice";
import { useEffect } from "react";

function TournamentInfo({ tournamentName, teamAName, teamBName, dispatch }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-left">
      <div>
        <label className="block font-medium mb-1">Turnuva Adı</label>
        <input
          type="text"
          value={tournamentName}
          onChange={(e) => dispatch(setTournamentName(e.target.value))}
          className="border rounded px-3 py-2 w-full text-black"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Takım A İsmi</label>
        <input
          type="text"
          value={teamAName}
          onChange={(e) => dispatch(setTeamAName(e.target.value))}
          className="border rounded px-3 py-2 w-full text-black"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Takım B İsmi</label>
        <input
          type="text"
          value={teamBName}
          onChange={(e) => dispatch(setTeamBName(e.target.value))}
          className="border rounded px-3 py-2 w-full text-black"
        />
      </div>
    </div>
  );
}

export default function ControlPanel() {
  const dispatch = useDispatch();
  const {
    teamA,
    teamB,
    servingTeam,
    serverNumber,
    teamAName,
    teamBName,
    tournamentName,
    setA,
    setB,
    sets,
    createdBy,
  } = useSelector((state) => state.match);

  useEffect(() => {
    const adminId = localStorage.getItem("adminId");
    if (adminId) {
      dispatch(setCreatedBy(adminId));
      socket.emit("joinRoom", adminId);
    }
  }, [dispatch]);

  useEffect(() => {
    if (createdBy) {
      socket.emit("scoreUpdated", {
        roomId: createdBy,
        data: {
          teamA,
          teamB,
          servingTeam,
          serverNumber,
          teamAName,
          teamBName,
          setA,
          setB,
          tournamentName,
        },
      });
    }
  }, [
    teamA,
    teamB,
    servingTeam,
    serverNumber,
    setA,
    setB,
    teamAName,
    teamBName,
    tournamentName,
    createdBy,
  ]);

  const handleServingChange = (team) => {
    dispatch(setServingTeam(team));
  };

  const handleServerNumberChange = (number) => {
    dispatch(setServerNumber(number));
  };

  const handleSaveToBackend = async () => {
    try {
      if (!teamAName || !teamBName || !tournamentName) {
        alert("Lütfen tüm takım isimlerini ve turnuva adını doldurun.");
        return;
      }
      if (sets.length === 0) {
        alert("En az bir set kaydetmeden maç bitirilemez.");
        return;
      }
      const payload = {
        teamAName,
        teamBName,
        tournamentName,
        sets,
        servingTeam,
        serverNumber,
        createdBy,
      };
      const res = await axios.post("http://localhost:5000/api/match", payload);
      console.log("Kayıt sonucu:", res.data);
      alert("Maç başarıyla kaydedildi ✔️");
      dispatch(clearSets());
      dispatch(resetScores());
      dispatch(setSetA(0));
      dispatch(setSetB(0));
    } catch (err) {
      console.error(err);
      alert("Kayıt başarısız ❌");
    }
  };

  const handleSetBitir = () => {
    const timestamp = new Date().toISOString();
    const newSet = { teamA, teamB, timestamp };
    dispatch(addSet(newSet));
    dispatch(resetScores());
  };

  const handleSmartSave = () => {
    if (teamA !== 0 || teamB !== 0) {
      alert(
        "Son set henüz bitirilmemiş. Lütfen önce 'Seti Bitir' butonunu kullanarak seti kaydedin."
      );
    } else {
      handleSaveToBackend();
    }
  };

  const ScoreCard = ({ team, score, onIncrement, onDecrement, color }) => (
    <div className="flex-1">
      <h3 className="text-xl font-semibold">Takım {team}</h3>
      <p className={`text-4xl font-bold text-${color}-600`}>{score}</p>
      <div className="space-x-2 mt-2">
        <button
          onClick={() => onIncrement()}
          className={`bg-${color}-500 text-white px-4 py-2 rounded`}
        >
          +1
        </button>
        <button
          onClick={() => onDecrement()}
          className={`bg-${color}-300 text-white px-4 py-2 rounded`}
        >
          -1
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 sm:p-8 rounded shadow-lg text-center space-y-6 relative max-w-5xl mx-auto">
      <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
        <button
          onClick={handleSetBitir}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded"
        >
          Seti Bitir
        </button>
        <button
          onClick={handleSmartSave}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Maçı Bitir ve Kaydet
        </button>
      </div>
      <h2 className="text-2xl font-bold text-left">Kontrol Paneli</h2>
      <TournamentInfo
        tournamentName={tournamentName}
        teamAName={teamAName}
        teamBName={teamBName}
        dispatch={dispatch}
      />
      <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 mb-6">
        <div>
          <label className="block font-medium mb-1">Servis Takımı</label>
          <select
            value={servingTeam}
            onChange={(e) => handleServingChange(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="">Seçin</option>
            <option value="A">Takım A</option>
            <option value="B">Takım B</option>
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Servisçi No</label>
          <select
            value={serverNumber}
            onChange={(e) => handleServerNumberChange(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            <option value="">Seçin</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-8">
        <ScoreCard
          team="A"
          score={teamA}
          onIncrement={() => dispatch(incrementTeamA())}
          onDecrement={() => dispatch(decrementTeamA())}
          color="blue"
        />
        <ScoreCard
          team="B"
          score={teamB}
          onIncrement={() => dispatch(incrementTeamB())}
          onDecrement={() => dispatch(decrementTeamB())}
          color="green"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="text-center">
          <h4 className="text-lg font-semibold">Set Sayısı - Takım A</h4>
          <p className="text-3xl font-bold text-blue-700">{setA}</p>
          <div className="space-x-2 mt-2">
            <button
              onClick={() => dispatch(setSetA(setA + 1))}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              +1
            </button>
            <button
              onClick={() => dispatch(setSetA(setA > 0 ? setA - 1 : 0))}
              className="bg-blue-300 text-white px-4 py-2 rounded"
            >
              -1
            </button>
          </div>
        </div>
        <div className="text-center">
          <h4 className="text-lg font-semibold">Set Sayısı - Takım B</h4>
          <p className="text-3xl font-bold text-green-700">{setB}</p>
          <div className="space-x-2 mt-2">
            <button
              onClick={() => dispatch(setSetB(setB + 1))}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              +1
            </button>
            <button
              onClick={() => dispatch(setSetB(setB > 0 ? setB - 1 : 0))}
              className="bg-green-300 text-white px-4 py-2 rounded"
            >
              -1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
