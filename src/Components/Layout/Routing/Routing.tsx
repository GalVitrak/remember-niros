import { Route, Routes } from "react-router-dom";
import "./Routing.css";

export function Routing(): React.ReactElement {
  return (
    <div className="Routing">
      <Routes>
        <Route
          path="/"
          element={<div>Home</div>}
        />
        <Route
          path="/about"
          element={<div>About</div>}
        />
      </Routes>
    </div>
  );
}
