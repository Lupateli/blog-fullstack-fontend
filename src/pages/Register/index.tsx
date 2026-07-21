import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { UserPlus } from "lucide-react";

import { Button } from "../../components/Button";
import { Input } from "../../components/Input";
import { api } from "../../services/api";

import "../../styles/auth.css";

type RegisterResponse = {
  message?: string;
  token?: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
};

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      setIsLoading(true);

      await api.post<RegisterResponse>("/auth/register", {
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Não foi possível criar a conta.";

        setError(message);
        return;
      }

      setError("Não foi possível criar a conta.");
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

          <h1>Criar uma conta</h1>
          <p>Cadastre-se para começar a publicar seus artigos</p>
        </div>

        <section className="auth-card">
          <form className="auth-form" onSubmit={handleRegister}>
            <Input
              id="name"
              name="name"
              type="text"
              label="Nome Completo"
              placeholder="John Doe"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isLoading}
            />

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

            <Input
              id="password"
              name="password"
              type="password"
              label="Senha"
              placeholder="********"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isLoading}
            />

            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              label="Confirmar senha"
              placeholder="********"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              disabled={isLoading}
            />

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
              <span className="auth-button-content">
                <UserPlus size={15} />

                {isLoading ? "Criando conta..." : "Criar conta"}
              </span>
            </Button>
          </form>

          <p className="auth-card-footer">
            Já tem uma conta?{" "}
            <Link to="/login">Fazer login</Link>
          </p>
        </section>
      </div>
    </main>
  );
}