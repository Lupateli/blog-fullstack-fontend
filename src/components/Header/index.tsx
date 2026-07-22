import { Link, useNavigate } from "react-router-dom";
import { Moon } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import "./styles.css";

export function Header() {
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          {"<M/>"}
        </Link>

        <nav className="header__nav" aria-label="Navegação principal">
          <Link to="/">Home</Link>
          <Link to="/artigos">Artigos</Link>

          {isAuthenticated && (
            <Link to="/dashboard">Dashboard</Link>
          )}

          <span className="header__divider" />

          <button
            type="button"
            className="header__theme-button"
            aria-label="Alternar tema"
          >
            <Moon size={16} />
          </button>

          {isAuthenticated ? (
            <div className="header__authenticated">
              <Link to="/posts/new" className="header__new-post">
                Novo artigo
              </Link>
              <span className="header__user-name">
                {user?.name || "Usuário"}
              </span>

              <button
                type="button"
                className="header__logout"
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="header__login">
                Entrar
              </Link>

              <Link to="/register" className="header__register">
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}