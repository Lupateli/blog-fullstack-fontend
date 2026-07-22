import axios from "axios";
import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { api } from "../../services/api";

import "./styles.css";

type Post = {
  id: number;
  title: string;
  summary?: string | null;
  content?: string | null;
  category?: string | null;
  tags?: string[] | string | null;
  banner?: string | null;
};

const categories = [
  "Desenvolvimento web",
  "Inteligência Artificial",
  "Backend",
  "Frontend",
  "DevOps",
  "Carreira",
];

function normalizeTags(
  tags?: string[] | string | null,
): string[] {
  if (!tags) {
    return [];
  }

  if (Array.isArray(tags)) {
    return tags
      .filter(
        (tag): tag is string =>
          typeof tag === "string",
      )
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  const normalizedValue = tags.trim();

  if (!normalizedValue) {
    return [];
  }

  try {
    const parsedTags: unknown =
      JSON.parse(normalizedValue);

    if (Array.isArray(parsedTags)) {
      return parsedTags
        .filter(
          (tag): tag is string =>
            typeof tag === "string",
        )
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  } catch {
    // Caso não seja JSON, separa por vírgulas.
  }

  return normalizedValue
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function getBannerName(
  banner?: string | null,
) {
  if (!banner) {
    return "";
  }

  const normalizedBanner =
    banner.replaceAll("\\", "/");

  const parts = normalizedBanner.split("/");

  return parts[parts.length - 1] || banner;
}

export function EditPost() {
  const { id: idParam } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();

  const postId = Number(idParam);

  const hasValidPostId =
    Number.isInteger(postId) && postId > 0;

  const [title, setTitle] = useState("");
  const [summary, setSummary] =
    useState("");

  const [category, setCategory] =
    useState("Desenvolvimento web");

  const [content, setContent] =
    useState("");

  const [banner, setBanner] =
    useState<File | null>(null);

  const [bannerName, setBannerName] =
    useState("");

  const [tagInput, setTagInput] =
    useState("");

  const [tags, setTags] =
    useState<string[]>([]);

  const [error, setError] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const wordCount = useMemo(() => {
    return content.trim()
      ? content.trim().split(/\s+/).length
      : 0;
  }, [content]);

  const readingTime = Math.max(
    1,
    Math.ceil(wordCount / 200),
  );

  useEffect(() => {
    let componentIsMounted = true;

    async function loadPost() {
      if (!hasValidPostId) {
        setError("ID do artigo inválido.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const response = await api.get<Post>(
          `/posts/${postId}`,
        );

        if (!componentIsMounted) {
          return;
        }

        const post = response.data;

        setTitle(post.title ?? "");
        setSummary(post.summary ?? "");
        setContent(post.content ?? "");

        setCategory(
          post.category ||
            "Desenvolvimento web",
        );

        setTags(normalizeTags(post.tags));

        setBannerName(
          getBannerName(post.banner),
        );
      } catch (requestError) {
        console.error(
          "Erro ao carregar artigo:",
          requestError,
        );

        if (!componentIsMounted) {
          return;
        }

        if (
          axios.isAxiosError(requestError) &&
          requestError.response?.status === 404
        ) {
          setError("Artigo não encontrado.");
        } else if (
          axios.isAxiosError(requestError) &&
          requestError.response?.status === 401
        ) {
          setError(
            "Você precisa estar autenticado.",
          );
        } else {
          setError(
            "Não foi possível carregar o artigo.",
          );
        }
      } finally {
        if (componentIsMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPost();

    return () => {
      componentIsMounted = false;
    };
  }, [postId, hasValidPostId]);

  function handleBannerChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError(
        "Selecione um arquivo de imagem válido.",
      );

      return;
    }

    setError("");
    setBanner(file);
    setBannerName(file.name);
  }

  function addTag() {
    const normalizedTag =
      tagInput.trim();

    if (!normalizedTag) {
      return;
    }

    const alreadyExists = tags.some(
      (tag) =>
        tag.toLowerCase() ===
        normalizedTag.toLowerCase(),
    );

    if (alreadyExists) {
      setTagInput("");
      return;
    }

    setTags((currentTags) => [
      ...currentTags,
      normalizedTag,
    ]);

    setTagInput("");
  }

  function removeTag(
    tagToRemove: string,
  ) {
    setTags((currentTags) =>
      currentTags.filter(
        (tag) => tag !== tagToRemove,
      ),
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!hasValidPostId) {
      setError("ID do artigo inválido.");
      return;
    }

    setError("");

    if (!title.trim()) {
      setError(
        "Informe o título do artigo.",
      );

      return;
    }

    if (!summary.trim()) {
      setError(
        "Informe o resumo do artigo.",
      );

      return;
    }

    if (!content.trim()) {
      setError(
        "Escreva o conteúdo do artigo.",
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append(
        "title",
        title.trim(),
      );

      formData.append(
        "summary",
        summary.trim(),
      );

      formData.append(
        "content",
        content.trim(),
      );

      formData.append(
        "category",
        category,
      );

      formData.append(
        "tags",
        JSON.stringify(tags),
      );

      /*
       * Se nenhuma nova imagem for escolhida,
       * o backend deve manter a imagem anterior.
       */
      if (banner) {
        formData.append(
          "banner",
          banner,
        );
      }

      const response =
        await api.put<Post>(
          `/posts/${postId}`,
          formData,
        );

      navigate(
        `/posts/${response.data.id}`,
      );
    } catch (requestError) {
      console.error(
        "Erro ao atualizar artigo:",
        requestError,
      );

      if (axios.isAxiosError(requestError)) {
        setError(
          requestError.response?.data
            ?.message ??
            "Não foi possível atualizar o artigo.",
        );
      } else {
        setError(
          "Não foi possível atualizar o artigo.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="edit-post-page">
        <div className="edit-post-container">
          <p className="edit-post-message">
            Carregando artigo...
          </p>
        </div>
      </main>
    );
  }

  if (error && !title) {
    return (
      <main className="edit-post-page">
        <div className="edit-post-container">
          <div className="edit-post-message edit-post-message--error">
            <p>{error}</p>

            <Link to="/dashboard">
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="edit-post-page">
      <div className="edit-post-container">
        <Link
          to="/dashboard"
          className="edit-post-back"
        >
          ← Voltar ao Dashboard
        </Link>

        <header className="edit-post-header">
          <h1>Editar Artigo</h1>

          <p>
            Atualize as informações do seu
            artigo.
          </p>
        </header>

        <form
          className="edit-post-form"
          onSubmit={handleSubmit}
        >
          <div className="edit-post-field">
            <label htmlFor="title">
              Título do Artigo *
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(event.target.value)
              }
              placeholder="Digite o título do artigo"
              disabled={isSubmitting}
            />
          </div>

          <div className="edit-post-field">
            <label htmlFor="summary">
              Resumo *
            </label>

            <textarea
              id="summary"
              value={summary}
              onChange={(event) =>
                setSummary(
                  event.target.value,
                )
              }
              placeholder="Escreva um breve resumo do artigo"
              maxLength={120}
              rows={4}
              disabled={isSubmitting}
            />

            <span className="edit-post-counter">
              {summary.length}/120 caracteres
            </span>
          </div>

          <div className="edit-post-field">
            <label htmlFor="category">
              Categoria *
            </label>

            <select
              id="category"
              value={category}
              onChange={(event) =>
                setCategory(
                  event.target.value,
                )
              }
              disabled={isSubmitting}
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="edit-post-field">
            <label htmlFor="banner">
              Imagem de Capa
            </label>

            <label
              htmlFor="banner"
              className="edit-post-banner-label"
            >
              {bannerName ||
                "Selecionar nova imagem"}
            </label>

            <input
              id="banner"
              className="edit-post-file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleBannerChange}
              disabled={isSubmitting}
            />

            <span className="edit-post-help">
              Se nenhuma imagem nova for
              selecionada, a imagem atual será
              mantida.
            </span>
          </div>

          <div className="edit-post-field">
            <label htmlFor="tags">
              Tags
            </label>

            <div className="edit-post-tags-control">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(event) =>
                  setTagInput(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Digite uma tag"
                disabled={isSubmitting}
              />

              <button
                type="button"
                className="edit-post-add-tag"
                onClick={addTag}
                disabled={isSubmitting}
              >
                Adicionar
              </button>
            </div>

            {tags.length > 0 && (
              <div className="edit-post-tags">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() =>
                      removeTag(tag)
                    }
                    disabled={isSubmitting}
                  >
                    {tag}
                    <span>×</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="edit-post-field">
            <label htmlFor="content">
              Conteúdo do Artigo *
            </label>

            <textarea
              id="content"
              value={content}
              onChange={(event) =>
                setContent(
                  event.target.value,
                )
              }
              placeholder="Escreva o conteúdo completo do artigo..."
              rows={18}
              maxLength={8000}
              disabled={isSubmitting}
            />

            <div className="edit-post-content-info">
              <span>
                {content.length}/8000
                caracteres
              </span>

              <span>
                {wordCount} palavras
              </span>

              <span>
                {readingTime} minutos de
                leitura
              </span>
            </div>
          </div>

          {error && (
            <p
              className="edit-post-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="edit-post-actions">
            <button
              type="submit"
              className="edit-post-submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Salvando..."
                : "Salvar Alterações"}
            </button>

            <Link
              to="/dashboard"
              className="edit-post-cancel"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}