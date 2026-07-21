import { Github, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

import "./styles.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              {"<M/>"}
            </Link>

            <p className="footer__description">
              Seu portal de tecnologia com artigos, tutoriais e novidades do
              mundo tech.
            </p>
          </div>

          <div className="footer__links">
            <div className="footer__column">
              <h3>Navegação</h3>

              <Link to="/">Home</Link>
              <Link to="/artigos">Artigos</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>

            <div className="footer__column">
              <h3>Redes Sociais</h3>

              <div className="footer__socials">
                <a href="#" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>

                <a href="#" aria-label="GitHub">
                  <Github size={18} />
                </a>

                <a href="#" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2025 TechBlog. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}