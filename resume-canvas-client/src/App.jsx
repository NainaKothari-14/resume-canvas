import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Editor from "./pages/Editor.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/editor" element={<Editor />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
