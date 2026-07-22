import axios from "axios";
import {
  ArrowLeft,
  Mail,
  UserRound,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link } from "react-router-dom";

import {
  useAuth,
  type User,
} from "../../contexts/AuthContext";
import { api } from "../../services/api";

import "./styles.css";

type ProfileResponse = User;

function formatDate(createdAt?: string) {
  if (!createdAt) {
    return "Data indisponível";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "U";
  }

  const names = name.trim().split(/\s+/);

  if (names.length === 1) {
    return names[0][0].toUpperCase();
  }

  return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
}

function resolveAvatarUrl(avatar?: string | null) {
  if (!avatar) {
    return "";
  }

  if (
    avatar.startsWith("http://") ||
    avatar.startsWith("https://") ||
    avatar.startsWith("blob:")
  ) {
    return avatar;
  }

  const apiUrl =
    import.meta.env.VITE_API_URL ??
    "http://localhost:3000";

  return `${apiUrl}${avatar.startsWith("/") ? "" : "/"}${avatar}`;
}

export function ProfileSettings() {
  const { updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(
    null,
  );

  const [profile, setProfile] =
    useState<ProfileResponse | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");

  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  const [avatarPreview, setAvatarPreview] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        setIsLoading(true);
        setError("");

        const response =
          await api.get<ProfileResponse>("/users/me");

        if (!isMounted) {
          return;
        }

        const user = response.data;

        setProfile(user);
        setName(user.name ?? "");
        setEmail(user.email ?? "");
        setBio(user.bio ?? "");
        setAvatarPreview(
          resolveAvatarUrl(user.avatar),
        );

        updateUser(user);
      } catch (requestError) {
        if (!isMounted) {
          return;
        }

        setError(
          axios.isAxiosError(requestError)
            ? requestError.response?.data?.message ??
                "Não foi possível carregar o perfil."
            : "Não foi possível carregar o perfil.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  function handleAvatarChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Selecione uma imagem JPG, PNG ou WEBP.",
      );
      event.target.value = "";
      return;
    }

    const maxSizeInBytes = 5 * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      setError(
        "A imagem deve ter no máximo 5 MB.",
      );
      event.target.value = "";
      return;
    }

    if (avatarPreview.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setError("");
    setSuccess("");
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Informe o nome completo.");
      return;
    }

    if (!email.trim() || !email.includes("@")) {
      setError("Informe um e-mail válido.");
      return;
    }

    if (bio.length > 500) {
      setError(
        "A biografia deve ter no máximo 500 caracteres.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("email", email.trim());
      formData.append("bio", bio);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const response =
        await api.put<ProfileResponse>(
          "/users/me",
          formData,
        );

      const updatedUser = response.data;

      setProfile(updatedUser);
      setName(updatedUser.name ?? "");
      setEmail(updatedUser.email ?? "");
      setBio(updatedUser.bio ?? "");
      setAvatarFile(null);
      setAvatarPreview(
        resolveAvatarUrl(updatedUser.avatar),
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      updateUser(updatedUser);
      setSuccess(
        "Alterações salvas com sucesso.",
      );
    } catch (requestError) {
      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message ??
              "Não foi possível atualizar o perfil."
          : "Não foi possível atualizar o perfil.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="profile-page">
        <div className="profile-page__container">
          <p className="profile-page__status">
            Carregando perfil...
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="profile-page">
        <div className="profile-page__container">
          <p className="profile-page__status profile-page__status--error">
            {error || "Perfil não encontrado."}
          </p>
        </div>
      </main>
    );
  }

  const roleLabel =
    profile.role === "ADMIN"
      ? "Admin"
      : "Usuário";

  return (
    <main className="profile-page">
      <div className="profile-page__container">
        <Link
          to="/dashboard"
          className="profile-page__back"
        >
          <ArrowLeft size={17} />
          Voltar ao Dashboard
        </Link>

        <div className="profile-page__divider" />

        <header className="profile-page__header">
          <h1>Configurações do Perfil</h1>
          <p>Gerencie suas informações pessoais</p>
        </header>

        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          <section className="profile-form__content">
            <div className="profile-form__avatar-area">
              <button
                type="button"
                className="profile-form__avatar"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                aria-label="Selecionar foto de perfil"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={`Foto de perfil de ${name}`}
                  />
                ) : (
                  <span>{getInitials(name)}</span>
                )}
              </button>

              <label
                htmlFor="profile-avatar"
                className="profile-form__avatar-label"
              >
                Foto de Perfil
              </label>

              <input
                ref={fileInputRef}
                id="profile-avatar"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                className="profile-form__file-input"
                disabled={isSubmitting}
              />

              <button
                type="button"
                className="profile-form__upload-button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={isSubmitting}
              >
                Selecionar imagem
              </button>

              <small>
                JPG, PNG ou WEBP. Máximo de 5 MB.
              </small>
            </div>

            <div className="profile-form__fields">
              <div className="profile-form__field">
                <label htmlFor="profile-name">
                  <UserRound size={15} />
                  Nome Completo
                </label>

                <input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  maxLength={120}
                  disabled={isSubmitting}
                />
              </div>

              <div className="profile-form__field">
                <label htmlFor="profile-email">
                  <Mail size={15} />
                  Email
                </label>

                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="profile-form__field">
                <label htmlFor="profile-bio">
                  Bio
                </label>

                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(event) =>
                    setBio(event.target.value)
                  }
                  rows={5}
                  maxLength={500}
                  placeholder="Conte um pouco sobre você..."
                  disabled={isSubmitting}
                />

                <span className="profile-form__counter">
                  {bio.length}/500 caracteres
                </span>
              </div>
            </div>

            <div className="profile-form__separator" />

            <section className="profile-form__account">
              <h2>Informações da conta</h2>

              <div className="profile-form__account-grid">
                <div>
                  <span>Tipo de conta</span>
                  <strong>{roleLabel}</strong>
                </div>

                <div>
                  <span>Membro desde</span>
                  <strong>
                    {formatDate(profile.createdAt)}
                  </strong>
                </div>
              </div>
            </section>

            {error && (
              <p
                className="profile-form__feedback profile-form__feedback--error"
                role="alert"
              >
                {error}
              </p>
            )}

            {success && (
              <p
                className="profile-form__feedback profile-form__feedback--success"
                role="status"
              >
                {success}
              </p>
            )}

            <button
              type="submit"
              className="profile-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Salvando..."
                : "Salvar Alterações"}
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}
