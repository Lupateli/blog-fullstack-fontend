import { Outlet } from "react-router-dom";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import "./styles.css";

export function PublicLayout() {
  return (
    <div className="public-layout">
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
}