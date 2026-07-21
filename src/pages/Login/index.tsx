import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api } from "../../services/api";

import "../../styles/auth.css";

type LoginResponse = {
  token: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Preencha o e-mail e a senha.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      login(response.data.token, response.data.user);

      navigate("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ??
          "E-mail ou senha inválidos.";

        setError(message);
      } else {
        setError("Não foi possível realizar o login.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-content">
        <div className="auth-heading">
          <Link
            to="/"
            className="auth-logo"
            aria-label="Voltar para a página inicial"
          >
            {"<M/>"}
          </Link>

          <h1>Entrar na Plataforma</h1>

          <p>Acesse sua conta para gerenciar seus artigos</p>
        </div>

        <section className="auth-card">
          <form className="auth-form" onSubmit={handleLogin}>
            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="exemplo@email.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isLoading}
            />

            <div className="auth-password-field">
              <div className="auth-password-header">
                <label htmlFor="password">Senha</label>

                <Link to="/forgot-password">
                  Esqueceu a senha?
                </Link>
              </div>

              <input
                id="password"
                name="password"
                type="password"
                className="auth-password-input"
                placeholder="********"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isLoading}
              />
            </div>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          <p className="auth-card-footer">
            Não tem uma conta?{" "}
            <Link to="/register">Criar conta</Link>
          </p>
        </section>
      </div>
    </main>
  );
}