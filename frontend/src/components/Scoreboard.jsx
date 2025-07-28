// components/Scoreboard.jsx
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import socket from "../socket";
import Navbar from "./Navbar";
import {
  setServingTeam,
  setServerNumber,
  setSetA,
  setSetB,
  setTournamentName,
  setTeamAName,
  setTeamBName,
  setTeamAScore,
  setTeamBScore,
} from "../slices/matchSlice";

export default function Scoreboard() {
  const dispatch = useDispatch();
  const {
    teamA,
    teamB,
    servingTeam,
    serverNumber,
    setA,
    setB,
    tournamentName,
  } = useSelector((state) => state.match);

  const [showNavbar, setShowNavbar] = useState(false);
  let hideTimer;

  useEffect(() => {
    const handleMouseMove = () => {
      setShowNavbar(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => setShowNavbar(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    socket.on("scoreUpdated", (data) => {
      console.log("🔁 Skor güncellendi:", data);
      dispatch(setTeamAName(data.teamAName));
      dispatch(setTeamBName(data.teamBName));
      dispatch(setTournamentName(data.tournamentName));
      dispatch(setServingTeam(data.servingTeam));
      dispatch(setServerNumber(data.serverNumber));
      dispatch(setSetA(data.setA));
      dispatch(setSetB(data.setB));
      dispatch(setTeamAScore(data.teamA));
      dispatch(setTeamBScore(data.teamB));
    });

    return () => {
      socket.off("scoreUpdated");
    };
  }, [dispatch]);

  const renderServeArrow = () => {
    if (!servingTeam) return null;

    return (
      <div className="relative flex items-center justify-center w-full text-yellow-400 text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-bold">
        {servingTeam === "A" && (
          <span className="absolute left-0 select-none cursor-default">
            &lt;
          </span>
        )}
        <span className="w-32 h-32 rounded-full bg-yellow-400 text-black flex items-center justify-center text-4xl md:text-5xl lg:text-6xl xl:text-7xl select-none cursor-default">
          {serverNumber || ""}
        </span>
        {servingTeam === "B" && (
          <span className="absolute right-0 select-none cursor-default">
            &gt;
          </span>
        )}
      </div>
    );
  };

  return (
    <div>
      {showNavbar && (
        <div className="absolute top-0 left-0 right-0 z-50">
          <Navbar />
        </div>
      )}
      <div className="min-h-screen w-full flex flex-col bg-black text-white p-6 relative">
        <div className="flex flex-col items-center justify-start w-full bg-gray-700 rounded-2xl shadow-xl py-6 mb-12">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mt-4 mb-2 tracking-widest select-none cursor-default">
            PICKLEBALL
          </h1>
          <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-300 mt-4 select-none cursor-default">
            {tournamentName}
          </h2>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 w-full">
          <div className="grid grid-cols-3 items-center gap-12 mb-12 w-full">
            <div
              className={`text-center ${
                servingTeam === "A" ? "bg-gray-700" : "bg-gray-900"
              } rounded-2xl shadow-lg py-6`}
            >
              <h2 className="text-8xl md:text-9xl lg:text-[10rem] font-semibold text-blue-400 mb-4 select-none cursor-default">
                Takım A
              </h2>
              <p className="text-[10rem] md:text-[11rem] lg:text-[12rem] font-extrabold text-blue-300 select-none cursor-default">
                {teamA}
              </p>
              <p className="text-5xl md:text-6xl lg:text-7xl mt-6 text-blue-300 select-none cursor-default">
                Setler: {setA ?? 0}
              </p>
            </div>

            <div className="flex flex-col items-center">
              {renderServeArrow()}
            </div>

            <div
              className={`text-center ${
                servingTeam === "B" ? "bg-gray-700" : "bg-gray-900"
              } rounded-2xl shadow-lg py-6`}
            >
              <h2 className="text-8xl md:text-9xl lg:text-[10rem] font-semibold text-green-400 mb-4 select-none cursor-default">
                Takım B
              </h2>
              <p className="text-[10rem] md:text-[11rem] lg:text-[12rem] font-extrabold text-green-300 select-none cursor-default">
                {teamB}
              </p>
              <p className="text-5xl md:text-6xl lg:text-7xl mt-6 text-green-300 select-none cursor-default">
                Setler: {setB ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
