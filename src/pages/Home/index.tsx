import { Mail } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

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

export function Home() {
  const location = useLocation();

  const [posts, setPosts] = useState<Post[]>([]);
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
      } catch {
        if (componentIsMounted) {
          setPosts([]);
          setError("Não foi possível carregar os artigos.");
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
  }, [location.key]);

  const featuredPosts = posts.slice(0, 3);

  // Começa no quarto artigo para não repetir os destaques.
  const recentPosts = posts.slice(0, 9);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <h1>
            Explore o Futuro da
            <span>Tecnologia</span>
          </h1>

          <p>
            Artigos sobre IA, desenvolvimento, DevOps e as últimas
            tendências tecnológicas.
          </p>

          <div className="home-hero__actions">
            <Link
              to="/artigos"
              className="home-hero__primary-button"
            >
              Explorar Artigos
            </Link>

            <Link
              to="/register"
              className="home-hero__secondary-button"
            >
              Começar a Escrever
            </Link>
          </div>
        </div>
      </section>

      <div className="home-content">
        <section className="home-section">
          <div className="home-section__header">
            <div>
              <h2>Artigos em Destaque</h2>

              <p>
                Os melhores conteúdos selecionados para você
              </p>
            </div>

            <Link
              to="/artigos"
              className="home-section__link"
            >
              Ver todos →
            </Link>
          </div>

          {isLoading && (
            <p className="posts-message">
              Carregando artigos...
            </p>
          )}

          {!isLoading && error && (
            <p className="posts-message posts-error">
              {error}
            </p>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <p className="posts-message">
              Nenhum artigo publicado ainda.
            </p>
          )}

          {!isLoading &&
            !error &&
            featuredPosts.length > 0 && (
              <div className="featured-posts-grid">
                {featuredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    summary={getPostSummary(post)}
                    content={post.content || ""}
                    image={getBannerUrl(post.banner)}
                    category={post.category}
                    author={post.author}
                    variant="featured"
                    createdAt={post.createdAt}
                    views={post.views ?? 0}
                    likes={post.likesCount ?? 0}
                  />
                ))}
              </div>
            )}
        </section>

        <section className="home-section home-section--recent">
          <div className="home-section__header">
            <div>
              <h2>Artigos Recentes</h2>

              <p>Conteúdo recente da comunidade</p>
            </div>
          </div>

          {!isLoading &&
            !error &&
            recentPosts.length > 0 && (
              <div className="recent-posts-grid">
                {recentPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    summary={getPostSummary(post)}
                    content={post.content || ""}
                    image={getBannerUrl(post.banner)}
                    category={post.category}
                    author={post.author}
                    variant="recent"
                    createdAt={post.createdAt}
                    views={post.views ?? 0}
                    likes={post.likesCount ?? 0}
                  />
                ))}
              </div>
            )}

          {!isLoading &&
            !error &&
            posts.length > 0 &&
            recentPosts.length === 0 && (
              <p className="posts-message">
                Ainda não existem outros artigos recentes.
              </p>
            )}
        </section>
      </div>

      <section className="newsletter">
        <div className="newsletter__content">
          <div className="newsletter__icon">
            <Mail size={24} />
          </div>

          <h2>Newsletter Semanal</h2>

          <p>
            Receba os melhores artigos de tecnologia diretamente no seu
            email.
            <br />
            Sem spam, apenas conteúdo de qualidade.
          </p>

          <form
            className="newsletter__form"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="exemplo@email.com"
              aria-label="Seu endereço de e-mail"
            />

            <button type="submit">
              Inscrever
            </button>
          </form>

          <small>
            Mais de 10.000 desenvolvedores já recebem nossa newsletter
          </small>
        </div>
      </section>

      <section className="home-cta">
        <div className="home-cta__content">
          <h2>Compartilhe Seu Conhecimento</h2>

          <p>
            Junte-se à nossa comunidade de escritores e compartilhe suas
            experiências e conhecimentos em tecnologia.
          </p>

          <Link to="/register">
            Criar Conta Gratuita
          </Link>
        </div>
      </section>
    </main>
  );
}