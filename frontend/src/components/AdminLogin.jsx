// components/AdminLogin.jsx
import { useState } from "react";
import axios from "axios";

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminId", res.data._id);
      localStorage.setItem("adminName", res.data.name);

      onLogin(); // App.jsx tarafındaki yönlendirme
    } catch (err) {
      alert("Giriş başarısız: Email veya şifre yanlış");
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded p-6 w-full max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Girişi</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full text-black"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 w-full text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
