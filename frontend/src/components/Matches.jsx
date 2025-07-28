// components/Matches.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/match");

        // Tarihe göre yeniden eskiye sırala
        const sorted = res.data.sort((a, b) => {
          const timeA = new Date(a.createdAt || a.sets?.[0]?.timestamp || 0);
          const timeB = new Date(b.createdAt || b.sets?.[0]?.timestamp || 0);
          return timeB - timeA;
        });

        setMatches(sorted);
        setLoading(false);
      } catch (err) {
        console.error("Maçlar alınamadı:", err);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Bu maçı silmek istediğinizden emin misiniz?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/match/${id}`);
      setMatches(matches.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Silme hatası:", err);
      alert("Maç silinemedi ❌");
    }
  };

  if (loading) return <div className="text-center mt-10">Yükleniyor...</div>;
  if (matches.length === 0)
    return <div className="text-center mt-10">Hiç maç bulunamadı.</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Geçmiş Maçlar</h2>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-800">
              <th className="p-2 text-left">Tarih/Saat</th>
              <th className="p-2 text-left">Turnuva Adı</th>
              <th className="p-2 text-left">Maç Hakemi</th>
              <th className="p-2 text-left">Oyuncular</th>
              <th className="p-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => {
              const timestamp = match.sets?.[0]?.timestamp || match.createdAt;
              const formattedDate = timestamp
                ? new Date(timestamp).toLocaleString("tr-TR")
                : "Tarih bulunamadı";

              return (
                <tr key={match._id} className="border-b hover:bg-gray-100">
                  <td className="p-2 whitespace-nowrap">{formattedDate}</td>
                  <td className="p-2 whitespace-nowrap">
                    {match.tournamentName}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {match.createdBy?.name || "Bilinmiyor"}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {match.teamAName} vs {match.teamBName}
                  </td>
                  <td className="p-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/matches/${match._id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Detaylar
                    </button>
                    <button
                      onClick={() => handleDelete(match._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
