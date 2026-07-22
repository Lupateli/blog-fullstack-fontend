import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { api } from "../../services/api";

import "./styles.css";

type CreatedPost = {
  id: number;
  title: string;
  summary?: string | null;
  content: string;
  category?: string | null;
  tags?: string | null;
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

export function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState("Desenvolvimento web");
  const [content, setContent] = useState("");

  const [banner, setBanner] = useState<File | null>(null);
  const [bannerName, setBannerName] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([
    "Typescript",
    "Backend",
    "IA",
  ]);

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const wordCount = useMemo(() => {
    return content.trim()
      ? content.trim().split(/\s+/).length
      : 0;
  }, [content]);

  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  function handleBannerChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Selecione um arquivo de imagem válido.");
      return;
    }

    setError("");
    setBanner(file);
    setBannerName(file.name);
  }

  function addTag() {
    const normalizedTag = tagInput.trim();

    if (!normalizedTag) {
      return;
    }

    const alreadyExists = tags.some(
      (tag) => tag.toLowerCase() === normalizedTag.toLowerCase(),
    );

    if (alreadyExists) {
      setTagInput("");
      return;
    }

    setTags((currentTags) => [...currentTags, normalizedTag]);
    setTagInput("");
  }

  function removeTag(tagToRemove: string) {
    setTags((currentTags) =>
      currentTags.filter((tag) => tag !== tagToRemove),
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError("Informe o título do artigo.");
      return;
    }

    if (!summary.trim()) {
      setError("Informe o resumo do artigo.");
      return;
    }

    if (!content.trim()) {
      setError("Escreva o conteúdo do artigo.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

        formData.append("title", title.trim());
        formData.append("summary", summary.trim());
        formData.append("content", content.trim());
        formData.append("category", category);
        formData.append("tags", JSON.stringify(tags));

        if (banner) {
        formData.append("banner", banner);
        }

      const response = await api.post<CreatedPost>("/posts", formData);

      navigate(`/posts/${response.data.id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ??
            "Não foi possível criar o artigo.",
        );
      } else {
        setError("Não foi possível criar o artigo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="create-post-page">
      <div className="create-post-container">
        <header className="create-post-header">
          <h1>Criar Novo Artigo</h1>

          <p>Compartilhe seu conhecimento com a comunidade.</p>
        </header>

        <form className="create-post-form" onSubmit={handleSubmit}>
          <div className="create-post-field">
            <label htmlFor="title">Título do Artigo *</label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Digite o título do artigo"
              disabled={isSubmitting}
            />
          </div>

          <div className="create-post-field">
            <label htmlFor="summary">Resumo *</label>

            <textarea
              id="summary"
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="Escreva um breve resumo do artigo"
              maxLength={120}
              rows={4}
              disabled={isSubmitting}
            />

            <span className="create-post-counter">
              {summary.length}/120 caracteres
            </span>
          </div>

          <div className="create-post-field">
            <label htmlFor="category">Categoria *</label>

            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              disabled={isSubmitting}
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="create-post-field">
            <label htmlFor="banner">Imagem de Capa *</label>

            <label htmlFor="banner" className="create-post-banner-label">
              {bannerName || "Selecionar imagem"}
            </label>

            <input
              id="banner"
              className="create-post-file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleBannerChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="create-post-field">
            <label htmlFor="tags">Tags</label>

            <div className="create-post-tags-control">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Digite uma tag"
                disabled={isSubmitting}
              />

              <button
                type="button"
                className="create-post-add-tag"
                onClick={addTag}
                disabled={isSubmitting}
              >
                Adicionar
              </button>
            </div>

            {tags.length > 0 && (
              <div className="create-post-tags">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={isSubmitting}
                  >
                    {tag}
                    <span>×</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="create-post-field">
            <label htmlFor="content">Conteúdo do Artigo *</label>

            <textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Escreva o conteúdo completo do artigo..."
              rows={18}
              maxLength={8000}
              disabled={isSubmitting}
            />

            <div className="create-post-content-info">
              <span>{content.length}/8000 caracteres</span>
              <span>{wordCount} palavras</span>
              <span>{readingTime} minutos de leitura</span>
            </div>
          </div>

          {error && (
            <p className="create-post-error" role="alert">
              {error}
            </p>
          )}

          <div className="create-post-actions">
            <button
              type="submit"
              className="create-post-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publicando..." : "Publicar Artigo"}
            </button>

            <Link to="/dashboard" className="create-post-cancel">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}