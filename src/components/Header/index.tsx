import { Link } from "react-router-dom";
import { Moon } from "lucide-react";

import "./styles.css";

export function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          {"<M/>"}
        </Link>

        <nav className="header__nav" aria-label="Navegação principal">
          <Link to="/">Home</Link>
          <Link to="/artigos">Artigos</Link>

          <span className="header__divider" />

          <button
            type="button"
            className="header__theme-button"
            aria-label="Alternar tema"
          >
            <Moon size={16} />
          </button>

          <Link to="/login" className="header__login">
            Entrar
          </Link>

          <Link to="/cadastro" className="header__register">
            Cadastrar
          </Link>
        </nav>
      </div>
    </header>
  );
}