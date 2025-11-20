import { Route, Routes } from "react-router-dom";
import "./Routing.css";
import Auth from "../../Admin/Auth/Auth";
import Memories from "../../Home/Memories/Memories";

export function Routing(): React.ReactElement {
  return (
    <div className="Routing">
      <Routes>
        <Route
          path="/"
          element={<Memories />}
        />
        <Route
          path="/about"
          element={<div>About</div>}
        />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}
