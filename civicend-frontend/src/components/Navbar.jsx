import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">
          <NavLink to="/" end>
            CivicLink
          </NavLink>
        </div>

        <ul className="navbar-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/news" className={({ isActive }) => (isActive ? "active" : "")}>
              News
            </NavLink>
          </li>
          <li>
            <NavLink to="/complaints" className={({ isActive }) => (isActive ? "active" : "")}>
              Complaints
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
