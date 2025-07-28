// components/Navbar.jsx
import { useNavigate } from "react-router-dom";

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <div
        className="text-xl font-bold tracking-wide cursor-pointer"
        onClick={() => navigate("/")}
      >
        🎾 SkorBoard
      </div>
      <div className="space-x-4">
        <button
          onClick={() => navigate("/")}
          className="hover:underline hover:text-yellow-400 transition"
        >
          Kontrol Paneli
        </button>
        <button
          onClick={() => navigate("/scoreboard")}
          className="hover:underline hover:text-yellow-400 transition"
        >
          Skorboard
        </button>
        <button
          onClick={() => navigate("/matches")}
          className="hover:underline hover:text-yellow-400 transition"
        >
          Eski Maçlar
        </button>
        <button
          onClick={onLogout}
          className="hover:underline hover:text-red-400 transition"
        >
          Çıkış Yap
        </button>
      </div>
    </nav>
  );
}
