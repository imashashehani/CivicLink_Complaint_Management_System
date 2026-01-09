import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import News from "./pages/News";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />

        <main className="page-container">
          <Routes>
            <Route path="/" element={<News />} />
            <Route path="/news" element={<News />} />

            <Route
              path="/complaints"
              element={<div style={{ color: "white", padding: 20 }}>Complaints page (coming soon)</div>}
            />
            <Route
              path="/login"
              element={<div style={{ color: "white", padding: 20 }}>Login page (coming soon)</div>}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}
