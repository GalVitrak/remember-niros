import { Route, Routes } from "react-router-dom";
import "./Routing.css";
import Auth from "../../Admin/Auth/Auth";
import Memories from "../../Home/Memories/Memories";
import About from "../../Home/About/About";

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
          element={<About />}
        />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </div>
  );
}
