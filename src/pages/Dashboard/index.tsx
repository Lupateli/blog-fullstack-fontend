import axios from "axios";
import {
  Clock3,
  FileText,
  Heart,
  MessageSquare,
  Pencil,
  Plus,
  Settings,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

import "./styles.css";

type DashboardPost = {
  id: number;
  title: string;
  summary?: string | null;
  content?: string | null;
  banner?: string | null;
  createdAt: string;
  views?: number;
  likesCount: number;
  commentsCount: number;
};

type RecentComment = {
  id: number;
  content: string;
  createdAt: string;
  post: {
    id: number;
    title: string;
  };
  author: {
    id: number;
    name: string;
  };
};

type DashboardResponse = {
  posts: DashboardPost[];
  recentComments: RecentComment[];
};

function getBannerUrl(banner?: string | null) {
  if (!banner) {
    return null;
  }

  if (banner.startsWith("http")) {
    return banner;
  }

  return `http://localhost:3000/uploads/${banner}`;
}

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function getReadingTime(content?: string | null) {
  if (!content?.trim()) {
    return 1;
  }

  const words = content.trim().split(/\s+/).length;

  return Math.max(1, Math.ceil(words / 200));
}

export function Dashboard() {
  const { user } = useAuth();

  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [postToDelete, setPostToDelete] = useState<DashboardPost | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let componentIsMounted = true;

    async function loadDashboard() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get<DashboardResponse>(
          "/posts/dashboard",
        );

        if (!componentIsMounted) {
          return;
        }

        setPosts(
          Array.isArray(response.data.posts)
            ? response.data.posts
            : [],
        );

        setRecentComments(
          Array.isArray(response.data.recentComments)
            ? response.data.recentComments
            : [],
        );
      } catch (requestError) {
        console.error("Erro ao carregar dashboard:", requestError);

        if (!componentIsMounted) {
          return;
        }

        if (
          axios.isAxiosError(requestError) &&
          !requestError.response
        ) {
          setError("Não foi possível conectar ao servidor.");
        } else {
          setError(
            axios.isAxiosError(requestError)
              ? requestError.response?.data?.message ??
                  "Não foi possível carregar o dashboard."
              : "Não foi possível carregar o dashboard.",
          );
        }
      } finally {
        if (componentIsMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      componentIsMounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const totalLikes = posts.reduce(
      (total, post) => total + post.likesCount,
      0,
    );

    const totalComments = posts.reduce(
      (total, post) => total + post.commentsCount,
      0,
    );

    const averageReadingTime =
      posts.length > 0
        ? Math.round(
            posts.reduce(
              (total, post) =>
                total + getReadingTime(post.content),
              0,
            ) / posts.length,
          )
        : 0;

    return {
      totalPosts: posts.length,
      totalLikes,
      totalComments,
      averageReadingTime,
    };
  }, [posts]);

  async function handleDeletePost() {
    if (!postToDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      setError("");

      await api.delete(`/posts/${postToDelete.id}`);

      setPosts((currentPosts) =>
        currentPosts.filter(
          (post) => post.id !== postToDelete.id,
        ),
      );

      setRecentComments((currentComments) =>
        currentComments.filter(
          (comment) =>
            comment.post.id !== postToDelete.id,
        ),
      );

      setPostToDelete(null);
    } catch (requestError) {
      console.error("Erro ao excluir artigo:", requestError);

      setError(
        axios.isAxiosError(requestError)
          ? requestError.response?.data?.message ??
              "Não foi possível excluir o artigo."
          : "Não foi possível excluir o artigo.",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="dashboard-page">
      <div className="dashboard-container">
        <section className="dashboard-heading">
          <div>
            <h1>Dashboard</h1>
            <p>
              Bem-vindo de volta, {user?.name || "Usuário"}!
            </p>
          </div>

          <div className="dashboard-heading__actions">
            <button
              type="button"
              className="dashboard-settings"
              disabled
              title="Disponível em breve"
            >
              <Settings size={15} />
              Configurações
            </button>

            <Link
              to="/posts/new"
              className="dashboard-new-post"
            >
              <Plus size={16} />
              Novo Artigo
            </Link>
          </div>
        </section>

        {error && (
          <p className="dashboard-error" role="alert">
            {error}
          </p>
        )}

        <section className="dashboard-metrics">
          <article className="dashboard-metric">
            <div>
              <span>Total de Artigos</span>
              <strong>{metrics.totalPosts}</strong>
            </div>
            <FileText size={20} />
          </article>

          <article className="dashboard-metric">
            <div>
              <span>Engajamento</span>
              <strong>{metrics.totalComments}</strong>
            </div>
            <MessageSquare size={20} />
          </article>

          <article className="dashboard-metric">
            <div>
              <span>Curtidas</span>
              <strong>{metrics.totalLikes}</strong>
            </div>
            <Heart size={20} />
          </article>

          <article className="dashboard-metric">
            <div>
              <span>Tempo médio de leitura</span>
              <strong>
                {metrics.averageReadingTime} min
              </strong>
            </div>
            <TrendingUp size={20} />
          </article>
        </section>

        {isLoading ? (
          <p className="dashboard-message">
            Carregando dashboard...
          </p>
        ) : (
          <section className="dashboard-content">
            <article className="dashboard-panel">
              <header className="dashboard-panel__header">
                <h2>Meus Artigos</h2>
              </header>

              {posts.length === 0 ? (
                <div className="dashboard-empty">
                  <p>Você ainda não publicou artigos.</p>
                  <Link to="/posts/new">
                    Criar primeiro artigo
                  </Link>
                </div>
              ) : (
                <div className="dashboard-post-list">
                  {posts.map((post) => {
                    const bannerUrl = getBannerUrl(post.banner);

                    return (
                      <article
                        key={post.id}
                        className="dashboard-post"
                      >
                        <Link
                          to={`/posts/${post.id}`}
                          className="dashboard-post__image"
                        >
                          {bannerUrl ? (
                            <img
                              src={bannerUrl}
                              alt=""
                            />
                          ) : (
                            <span>
                              {post.title.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </Link>

                        <div className="dashboard-post__body">
                          <Link
                            to={`/posts/${post.id}`}
                            className="dashboard-post__title"
                          >
                            {post.title}
                          </Link>

                          <p>
                            {post.summary?.trim() ||
                              post.content?.slice(0, 120) ||
                              "Artigo sem resumo."}
                          </p>

                          <div className="dashboard-post__meta">
                            <span>{formatDate(post.createdAt)}</span>
                            <span>
                              <MessageSquare size={12} />
                              {post.commentsCount}
                            </span>
                            <span>
                              <Heart size={12} />
                              {post.likesCount}
                            </span>
                            <span>
                              <Clock3 size={12} />
                              {getReadingTime(post.content)} min
                            </span>
                          </div>
                        </div>

                        <div className="dashboard-post__actions">
                          <Link
                            to={`/posts/${post.id}/edit`}
                            className="dashboard-edit"
                          >
                            <Pencil size={14} />
                            Editar
                          </Link>

                          <button
                            type="button"
                            className="dashboard-delete"
                            onClick={() =>
                              setPostToDelete(post)
                            }
                          >
                            <Trash2 size={14} />
                            Excluir
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </article>

            <article className="dashboard-panel">
              <header className="dashboard-panel__header">
                <h2>Atividade Recente</h2>
              </header>

              {recentComments.length === 0 ? (
                <p className="dashboard-activity-empty">
                  Ainda não há comentários recentes.
                </p>
              ) : (
                <div className="dashboard-activity-list">
                  {recentComments.map((comment) => (
                    <article
                      key={comment.id}
                      className="dashboard-activity"
                    >
                      <div className="dashboard-activity__avatar">
                        {comment.author.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <p>
                          <strong>
                            {comment.author.name}
                          </strong>{" "}
                          comentou em
                        </p>

                        <Link to={`/posts/${comment.post.id}`}>
                          {comment.post.title}
                        </Link>

                        <span>
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </article>
          </section>
        )}
      </div>

      {postToDelete && (
        <div
          className="dashboard-modal-backdrop"
          role="presentation"
          onMouseDown={() => {
            if (!isDeleting) {
              setPostToDelete(null);
            }
          }}
        >
          <section
            className="dashboard-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-post-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="delete-post-title">Excluir Artigo</h2>

            <p>
              Tem certeza que deseja excluir este artigo? Esta
              ação não pode ser desfeita.
            </p>

            <div className="dashboard-modal__actions">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                disabled={isDeleting}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="dashboard-modal__delete"
                onClick={handleDeletePost}
                disabled={isDeleting}
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
