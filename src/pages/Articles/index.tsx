import {
  Grid2X2,
  List,
  Search,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PostCard } from "../../components/PostCard";
import { api } from "../../services/api";

import "./styles.css";

type Post = {
  id: number;
  title: string;
  summary?: string | null;
  content: string;
  banner?: string | null;
  category?: string | null;
  views: number;
  likesCount: number;
  likedByCurrentUser: boolean;
  createdAt: string;
  author?: {
    id: number;
    name: string;
  } | null;
};

type ViewMode = "grid" | "list";

const categoryOptions = [
  "Todas as categorias",
  "Desenvolvimento web",
  "Inteligência Artificial",
  "Backend",
  "Frontend",
  "DevOps",
  "Carreira",
];

function getBannerUrl(banner?: string | null) {
  if (!banner) {
    return undefined;
  }

  if (banner.startsWith("http")) {
    return banner;
  }

  return `http://localhost:3000/uploads/${banner}`;
}

function getPostSummary(post: Post) {
  const summary = post.summary?.trim();

  if (summary) {
    return summary;
  }

  const normalizedContent = post.content?.trim() || "";

  if (normalizedContent.length <= 160) {
    return normalizedContent;
  }

  return `${normalizedContent.slice(0, 160)}...`;
}

export function Articles() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(
    "Todas as categorias",
  );
  const [viewMode, setViewMode] =
    useState<ViewMode>("grid");

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let componentIsMounted = true;

    async function loadPosts() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get<Post[]>("/posts");

        if (!componentIsMounted) {
          return;
        }

        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else {
          setPosts([]);
          setError("A API retornou uma resposta inválida.");
        }
      } catch (requestError) {
        console.error(
          "Erro ao carregar artigos:",
          requestError,
        );

        if (componentIsMounted) {
          setPosts([]);
          setError(
            "Não foi possível carregar os artigos.",
          );
        }
      } finally {
        if (componentIsMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      componentIsMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        category === "Todas as categorias" ||
        post.category === category;

      const searchableContent = [
        post.title,
        post.summary,
        post.content,
        post.category,
        post.author?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchableContent.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [posts, search, category]);

  return (
    <main className="articles-page">
      <div className="articles-container">
        <header className="articles-header">
          <div>
            <h1>Todos os Artigos</h1>
            <p>
              Explore nossa coleção completa de artigos técnicos
            </p>
          </div>
        </header>

        <section className="articles-toolbar">
          <label className="articles-search">
            <Search size={15} />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Buscar artigos..."
              aria-label="Buscar artigos"
            />
          </label>

          <div className="articles-toolbar__right">
            <div className="articles-category">
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                aria-label="Filtrar por categoria"
              >
                {categoryOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="articles-view-toggle"
              aria-label="Modo de visualização"
            >
              <button
                type="button"
                className={
                  viewMode === "grid"
                    ? "articles-view-toggle__button articles-view-toggle__button--active"
                    : "articles-view-toggle__button"
                }
                onClick={() => setViewMode("grid")}
                aria-label="Visualização em grade"
                aria-pressed={viewMode === "grid"}
              >
                <Grid2X2 size={17} />
              </button>

              <button
                type="button"
                className={
                  viewMode === "list"
                    ? "articles-view-toggle__button articles-view-toggle__button--active"
                    : "articles-view-toggle__button"
                }
                onClick={() => setViewMode("list")}
                aria-label="Visualização em lista"
                aria-pressed={viewMode === "list"}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </section>

        {isLoading && (
          <p className="articles-message">
            Carregando artigos...
          </p>
        )}

        {!isLoading && error && (
          <p className="articles-message articles-message--error">
            {error}
          </p>
        )}

        {!isLoading &&
          !error &&
          filteredPosts.length === 0 && (
            <p className="articles-message">
              Nenhum artigo encontrado com os filtros atuais.
            </p>
          )}

        {!isLoading &&
          !error &&
          filteredPosts.length > 0 && (
            <section
              className={
                viewMode === "grid"
                  ? "articles-grid"
                  : "articles-list"
              }
            >
              {filteredPosts.map((post) => (
                <PostCard
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  summary={getPostSummary(post)}
                  content={post.content || ""}
                  image={getBannerUrl(post.banner)}
                  category={post.category}
                  author={post.author}
                  variant={
                    viewMode === "grid"
                      ? "featured"
                      : "list"
                  }
                  createdAt={post.createdAt}
                  views={post.views ?? 0}
                  likes={post.likesCount ?? 0}
                />
              ))}
            </section>
          )}
      </div>
    </main>
  );
}
