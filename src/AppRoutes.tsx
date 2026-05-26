import { Routes, Route } from "react-router-dom";
import App from "./App";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/:slug" element={<App />} />
      <Route path="/" element={<App />} />
    </Routes>
  );
}