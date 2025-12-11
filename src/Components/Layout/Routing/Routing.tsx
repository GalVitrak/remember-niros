import { Route, Routes } from "react-router-dom";
import "./Routing.css";
import Auth from "../../Admin/Auth/Auth";
import Memories from "../../Home/Memories/Memories";
import About from "../../Home/About/About";
import { AdminDashboard } from "../../Admin/Dashboard/AdminDashboard";

export function Routing(): React.ReactElement {

  return (
    <div className="Routing">
      <Routes>
        <Route path="/" element={<About />} />
        <Route
          path="/memories"
          element={<Memories />}
        />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/approve"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/pending"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/all"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/create-admin"
          element={<AdminDashboard />}
        />
        <Route
          path="/admin/users"
          element={<AdminDashboard />}
        />
      </Routes>
    </div>
  );
}
