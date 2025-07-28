// components/MatchDetails.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function MatchDetails() {
  const { id: matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef();

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/match/${matchId}`
        );
        setMatch(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Maç detayı alınamadı:", err);
        setLoading(false);
      }
    };

    fetchMatch();
  }, [matchId]);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `${match.tournamentName || "mac"}_${match.teamAName}_vs_${
          match.teamBName
        }.pdf`
      );
    } catch (err) {
      console.error("PDF oluşturulamadı:", err);
      alert("PDF indirilemedi ❌");
    }
  };

  if (loading) return <div className="text-center mt-10">Yükleniyor...</div>;
  if (!match) return <div className="text-center mt-10">Maç bulunamadı.</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
        >
          ← Geri Dön
        </button>

        <button
          onClick={handleDownloadPDF}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
        >
          PDF Olarak İndir
        </button>
      </div>

      <div
        ref={contentRef}
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
          padding: "20px",
        }}
      >
        <h2
          style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}
        >
          {match.tournamentName}
        </h2>
        <p style={{ marginBottom: "20px" }}>
          <strong>{match.teamAName}</strong> vs{" "}
          <strong>{match.teamBName}</strong>
        </p>

        <p style={{ marginBottom: "10px" }}>
          <strong>Hakem:</strong> {match.createdBy?.name || "Bilinmiyor"}
        </p>

        <div style={{ marginBottom: "20px" }}>
          <p>
            <strong>Kayıt Tarihi:</strong>{" "}
            {match.sets?.[0]?.timestamp
              ? new Date(match.sets[0].timestamp).toLocaleString("tr-TR")
              : "Yok"}
          </p>
        </div>

        {/* Set Kazanma Skoru Özeti */}
        <div
          style={{ marginBottom: "20px", fontWeight: "bold", fontSize: "16px" }}
        >
          {(() => {
            const setWinsA = match.sets.filter((s) => s.teamA > s.teamB).length;
            const setWinsB = match.sets.filter((s) => s.teamB > s.teamA).length;

            return `Set Skoru: ${match.teamAName} ${setWinsA} - ${setWinsB} ${match.teamBName}`;
          })()}
        </div>

        <h3
          style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}
        >
          Set Skorları
        </h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f0f0f0" }}>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>Set</th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                {match.teamAName}
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                {match.teamBName}
              </th>
              <th style={{ border: "1px solid #ccc", padding: "8px" }}>
                Tarih
              </th>
            </tr>
          </thead>
          <tbody>
            {match.sets.map((set, index) => {
              const teamAWon = set.teamA > set.teamB;
              const teamBWon = set.teamB > set.teamA;

              return (
                <tr key={index} style={{ textAlign: "center" }}>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {index + 1}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      backgroundColor: teamAWon ? "#d1e7dd" : "",
                      fontWeight: teamAWon ? "bold" : "normal",
                    }}
                  >
                    {set.teamA}
                  </td>
                  <td
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      backgroundColor: teamBWon ? "#d1e7dd" : "",
                      fontWeight: teamBWon ? "bold" : "normal",
                    }}
                  >
                    {set.teamB}
                  </td>
                  <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                    {set.timestamp
                      ? new Date(set.timestamp).toLocaleString("tr-TR")
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <p style={{ fontSize: "12px", color: "#888" }}>Maç ID: {match._id}</p>
      </div>
    </div>
  );
}
