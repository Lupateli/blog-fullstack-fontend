import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";
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
              Conteúdos sobre tecnologia, desenvolvimento, inteligência
              artificial e inovação para quem quer aprender e evoluir.
            </p>
          </div>

          <div className="footer__links">
            <nav className="footer__column" aria-label="Navegação do rodapé">
              <h3>Navegação</h3>

              <Link to="/">Home</Link>
              <Link to="/artigos">Artigos</Link>
              <Link to="/login">Entrar</Link>
              <Link to="/register">Cadastrar</Link>
            </nav>

            <div className="footer__column">
              <h3>Redes sociais</h3>

              <div className="footer__socials">
                <a
                  href="https://github.com/Lupateli"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaGithub size={18} />
                </a>

                <a
                  href="https://linkedin.com/in/seu-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin size={18} />
                </a>

                <a
                  href="https://x.com/seuusuario"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaTwitter size={18} />
                </a>
              </div>  
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} Mind Group. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}