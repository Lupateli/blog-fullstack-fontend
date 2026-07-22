import {
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";

import "./styles.css";

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "U";
  }

  const names = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return `${names[0].charAt(0)}${names[
    names.length - 1
  ].charAt(0)}`.toUpperCase();
}

export function Header() {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const { user, isAuthenticated, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handlePointerDown,
    );

    document.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  function handleLogout() {
    setIsMenuOpen(false);
    logout();
    navigate("/");
  }

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo">
          {"<M/>"}
        </Link>

        <nav
          className="header__nav"
          aria-label="Navegação principal"
        >
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

          {isAuthenticated ? (
            <div
              className="header__profile"
              ref={menuRef}
            >
              <button
                type="button"
                className={
                  isMenuOpen
                    ? "header__profile-button header__profile-button--open"
                    : "header__profile-button"
                }
                onClick={() =>
                  setIsMenuOpen((current) => !current)
                }
                aria-label="Abrir menu do perfil"
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
              >
                {getInitials(user?.name)}
              </button>

              {isMenuOpen && (
                <div
                  className="header__profile-menu"
                  role="menu"
                >
                  <div className="header__profile-info">
                    <div className="header__profile-avatar">
                      {getInitials(user?.name)}
                    </div>

                    <div>
                      <strong>
                        {user?.name || "Usuário"}
                      </strong>

                      <span>
                        {user?.email ||
                          "Email não informado"}
                      </span>
                    </div>
                  </div>

                  <div className="header__profile-menu-group">
                    <Link
                      to="/dashboard"
                      role="menuitem"
                      onClick={() =>
                        setIsMenuOpen(false)
                      }
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      role="menuitem"
                      disabled
                      title="Disponível em breve"
                    >
                      <Settings size={17} />
                      Configurações
                    </button>
                  </div>

                  <div className="header__profile-menu-group">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                    >
                      <LogOut size={17} />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="header__login"
              >
                Entrar
              </Link>

              <Link
                to="/register"
                className="header__register"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
