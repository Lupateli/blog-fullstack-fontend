import { Link } from "react-router-dom";

import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

import "./styles.css";

export function Login() {
  return (
    <main className="login-page">
      <div className="login-content">
        <div className="login-heading">
          <Link
            to="/"
            className="login-heading__logo"
            aria-label="Voltar para a página inicial"
          >
            {"<M/>"}
          </Link>

          <h1>Entrar na Plataforma</h1>

          <p>Acesse sua conta para gerenciar seus artigos</p>
        </div>

        <section className="login-card">
          <form className="login-form">
            <div className="login-form__field">
              <label htmlFor="email">Email</label>

              <div className="login-form__input-wrapper">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="exemplo@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-form__field">
              <div className="login-form__password-header">
                <label htmlFor="password">Senha</label>

                <Link to="/forgot-password">
                  Esqueceu a senha?
                </Link>
              </div>

              <div className="login-form__input-wrapper">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="********"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit">
              Entrar
            </Button>
          </form>

          <p className="login-card__register">
            Não tem uma conta?{" "}
            <Link to="/register">Criar conta</Link>
          </p>
        </section>
      </div>
    </main>
  );
}