// App.jsx
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import store from "./store";
import ControlPanel from "./components/ControlPanel";
import Scoreboard from "./components/Scoreboard";
import Matches from "./components/Matches";
import MatchDetails from "./components/MatchDetails";
import Navbar from "./components/Navbar";
import AdminLogin from "./components/AdminLogin";

function AppContent({ isAuthenticated, handleLogout }) {
  const location = useLocation();

  const isScoreboard = location.pathname === "/scoreboard";

  return (
    <div
      className={
        isScoreboard
          ? "m-0 p-0 w-screen h-screen bg-black"
          : "min-h-screen bg-gray-100"
      }
    >
      {isAuthenticated && !isScoreboard && <Navbar onLogout={handleLogout} />}

      <div className="flex items-center justify-center pt-8 px-4">
        <Routes>
          {!isAuthenticated ? (
            <Route
              path="*"
              element={<AdminLogin onLogin={() => window.location.reload()} />}
            />
          ) : (
            <>
              <Route path="/" element={<ControlPanel />} />
              <Route path="/scoreboard" element={<Scoreboard />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/matches/:id" element={<MatchDetails />} />
              <Route path="*" element={<div>Sayfa bulunamadı</div>} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    setIsAuthenticated(false);
  };

  return (
    <Provider store={store}>
      <Router>
        <AppContent
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
        />
      </Router>
    </Provider>
  );
}
