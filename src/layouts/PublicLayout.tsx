import { Outlet } from "react-router-dom";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

import "./styles.css";

export function PublicLayout() {
  return (
    <>
        <div className="public-layout">
        <Header />

        <main className="public-layout__content">
            <Outlet />
        </main>

        
        </div>
        <Footer />
    </>
  );
}