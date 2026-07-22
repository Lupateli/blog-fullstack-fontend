import axios from "axios";
import {
  Bookmark,
  Clock3,
  Eye,
  Heart,
  MessageSquare,
  Send,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import type { FormEvent } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";

import "./styles.css";

type Author = {
  id: number;
  name: string;
};

type Post = {
  id: number;
  title: string;
  summary?: string | null;
  content?: string | null;
  banner?: string | null;
  category?: string | null;
  tags?: string[] | string | null;
  createdAt: string;
  views?: number;
  likesCount?: number;
  likedByCurrentUser?: boolean;
  author?: Author | null;
};

type Comment = {
  id: number;
  content: string;
  createdAt: string;
  likesCount?: number;
  likedByCurrentUser?: boolean;
  author?: {
    id: number;
    name: string;
    avatar?: string | null;
  } | null;
};

function formatPostDate(createdAt?: string) {
  if (!createdAt) {
    return "Data indisponível";
  }

  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR").format(date);
}

function calculateReadingTime(content?: string | null) {
  if (!content?.trim()) {
    return 1;
  }

  const numberOfWords = content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(
    1,
    Math.ceil(numberOfWords / 200),
  );
}

function getBannerUrl(banner?: string | null) {
  if (!banner) {
    return null;
  }

  if (banner.startsWith("http")) {
    return banner;
  }

  return `http://localhost:3000/uploads/${banner}`;
}

function getInitials(name?: string | null) {
  if (!name?.trim()) {
    return "A";
  }

  const names = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (names.length === 1) {
    return names[0]
      .charAt(0)
      .toUpperCase();
  }

  const firstInitial = names[0]
    .charAt(0)
    .toUpperCase();

  const lastInitial = names[
    names.length - 1
  ]
    .charAt(0)
    .toUpperCase();

  return `${firstInitial}${lastInitial}`;
}

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

  if (typeof tags === "string") {
    const normalizedValue = tags.trim();

    if (!normalizedValue) {
      return [];
    }

    /*
     * Primeiro tenta converter uma string JSON:
     * '["React","Node"]'
     */
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
      /*
       * Se não for JSON, continua para a
       * separação por vírgulas.
       */
    }

    /*
     * Converte:
     * "React, Node, TypeScript"
     */
    return normalizedValue
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
}

function getContentParagraphs(
  content?: string | null,
) {
  if (!content?.trim()) {
    return [];
  }

  return content
    .split("\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function PostDetails() {
  const { id: idParam } = useParams<{
    id: string;
  }>();

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [post, setPost] =
    useState<Post | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isUpdatingLike, setIsUpdatingLike] =
    useState(false);

  const [error, setError] = useState("");

  const [comments, setComments] =
    useState<Comment[]>([]);

  const [commentContent, setCommentContent] =
    useState("");

  const [isLoadingComments, setIsLoadingComments] =
    useState(true);

  const [isSubmittingComment, setIsSubmittingComment] =
    useState(false);

  const [commentsError, setCommentsError] =
    useState("");

  const [commentFormError, setCommentFormError] =
    useState("");

  const postId = Number(idParam);

  const hasValidPostId =
    Number.isInteger(postId) && postId > 0;

  useEffect(() => {
    let componentIsMounted = true;

    async function loadPost() {
      if (!hasValidPostId) {
        if (componentIsMounted) {
          setError("ID do artigo inválido.");
          setIsLoading(false);
        }

        return;
      }

      try {
        setIsLoading(true);
        setError("");

        /*
         * Primeiro carrega o post.
         *
         * Assim, mesmo que a rota de visualização
         * falhe, o artigo ainda será exibido.
         */
        const response = await api.get<Post>(
          `/posts/${postId}`,
        );

        if (!componentIsMounted) {
          return;
        }

        if (
          !response.data ||
          typeof response.data !== "object"
        ) {
          setError(
            "O servidor retornou um artigo inválido.",
          );

          return;
        }

        setPost(response.data);

        /*
         * Registra somente uma visualização por aba.
         */
        const viewStorageKey =
          `viewed-post-${postId}`;

        const alreadyViewed =
          sessionStorage.getItem(
            viewStorageKey,
          );

        if (!alreadyViewed) {
          try {
            await api.patch(
              `/posts/${postId}/view`,
            );

            sessionStorage.setItem(
              viewStorageKey,
              "true",
            );

            if (componentIsMounted) {
              setPost((currentPost) => {
                if (!currentPost) {
                  return currentPost;
                }

                return {
                  ...currentPost,
                  views:
                    (currentPost.views ?? 0) +
                    1,
                };
              });
            }
          } catch (viewError) {
            /*
             * Uma falha ao registrar visualização
             * não deve impedir o artigo de abrir.
             */
            console.error(
              "Erro ao registrar visualização:",
              viewError,
            );
          }
        }
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
          !requestError.response
        ) {
          setError(
            "Não foi possível conectar ao servidor.",
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

  useEffect(() => {
    let componentIsMounted = true;

    async function loadComments() {
      if (!hasValidPostId) {
        if (componentIsMounted) {
          setComments([]);
          setIsLoadingComments(false);
        }

        return;
      }

      try {
        setIsLoadingComments(true);
        setCommentsError("");

        const response = await api.get<Comment[]>(
          `/posts/${postId}/comments`,
        );

        if (!componentIsMounted) {
          return;
        }

        setComments(
          Array.isArray(response.data)
            ? response.data
            : [],
        );
      } catch (requestError) {
        console.error(
          "Erro ao carregar comentários:",
          requestError,
        );

        if (!componentIsMounted) {
          return;
        }

        setComments([]);

        if (
          axios.isAxiosError(requestError) &&
          requestError.response?.status === 404
        ) {
          setCommentsError(
            "A rota de comentários não foi encontrada no servidor.",
          );
        } else if (
          axios.isAxiosError(requestError) &&
          !requestError.response
        ) {
          setCommentsError(
            "Não foi possível conectar ao servidor para carregar os comentários.",
          );
        } else {
          setCommentsError(
            "Não foi possível carregar os comentários.",
          );
        }
      } finally {
        if (componentIsMounted) {
          setIsLoadingComments(false);
        }
      }
    }

    loadComments();

    return () => {
      componentIsMounted = false;
    };
  }, [postId, hasValidPostId]);

  async function handleSubmitComment(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!hasValidPostId || isSubmittingComment) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const content = commentContent.trim();

    if (content.length < 3) {
      setCommentFormError(
        "Digite pelo menos 3 caracteres.",
      );
      return;
    }

    try {
      setIsSubmittingComment(true);
      setCommentFormError("");

      const response = await api.post<Comment>(
        `/posts/${postId}/comments`,
        {
          content,
        },
      );

      setComments((currentComments) => [
        response.data,
        ...currentComments,
      ]);

      setCommentContent("");
      setCommentsError("");
    } catch (requestError) {
      console.error(
        "Erro ao publicar comentário:",
        requestError,
      );

      if (
        axios.isAxiosError(requestError) &&
        requestError.response?.status === 401
      ) {
        navigate("/login");
        return;
      }

      const responseMessage =
        axios.isAxiosError(requestError) &&
        typeof requestError.response?.data?.message ===
          "string"
          ? requestError.response.data.message
          : null;

      setCommentFormError(
        responseMessage ||
          "Não foi possível publicar o comentário.",
      );
    } finally {
      setIsSubmittingComment(false);
    }
  }

  async function handleLike() {
    if (!post || isUpdatingLike) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const wasLiked =
      post.likedByCurrentUser ?? false;

    const previousLikesCount =
      post.likesCount ?? 0;

    /*
     * Atualização otimista:
     * muda a tela antes da API responder.
     */
    setPost((currentPost) => {
      if (!currentPost) {
        return currentPost;
      }

      return {
        ...currentPost,
        likedByCurrentUser: !wasLiked,
        likesCount: wasLiked
          ? Math.max(
              0,
              previousLikesCount - 1,
            )
          : previousLikesCount + 1,
      };
    });

    try {
      setIsUpdatingLike(true);

      if (wasLiked) {
        await api.delete(
          `/posts/${post.id}/like`,
        );
      } else {
        await api.post(
          `/posts/${post.id}/like`,
        );
      }
    } catch (likeError) {
      /*
       * Desfaz a alteração caso a API falhe.
       */
      setPost((currentPost) => {
        if (!currentPost) {
          return currentPost;
        }

        return {
          ...currentPost,
          likedByCurrentUser: wasLiked,
          likesCount: previousLikesCount,
        };
      });

      console.error(
        "Erro ao atualizar curtida:",
        likeError,
      );

      if (
        axios.isAxiosError(likeError) &&
        likeError.response?.status === 401
      ) {
        navigate("/login");
      }
    } finally {
      setIsUpdatingLike(false);
    }
  }

  async function handleShare() {
    if (!post) {
      return;
    }

    const shareData = {
      title: post.title,
      text: post.summary || undefined,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(
        window.location.href,
      );

      window.alert(
        "Link copiado para a área de transferência.",
      );
    } catch (shareError) {
      console.error(
        "Não foi possível compartilhar:",
        shareError,
      );
    }
  }

  if (isLoading) {
    return (
      <main className="post-details-page">
        <p className="post-details-message">
          Carregando artigo...
        </p>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="post-details-page">
        <div className="post-details-message post-details-error">
          <p>
            {error || "Artigo não encontrado."}
          </p>

          <Link to="/">
            Voltar para a Home
          </Link>
        </div>
      </main>
    );
  }

  const content = post.content ?? "";

  const paragraphs =
    getContentParagraphs(content);

  const tags = normalizeTags(post.tags);

  const bannerUrl =
    getBannerUrl(post.banner);

  const readingTime =
    calculateReadingTime(content);

  const authorName =
    post.author?.name ||
    "Autor desconhecido";

  const likesCount =
    post.likesCount ?? 0;

  const views = post.views ?? 0;

  const likedByCurrentUser =
    post.likedByCurrentUser ?? false;

  return (
    <main className="post-details-page">
      <article className="post-details">
        <Link
          to="/"
          className="post-details__back"
        >
          ← Voltar aos artigos
        </Link>

        <header className="post-details__header">
          {post.category && (
            <span className="post-details__category">
              {post.category}
            </span>
          )}

          <h1>{post.title}</h1>

          <p className="post-details__description">
            {post.summary?.trim() ||
              content.slice(0, 160) ||
              "Este artigo não possui resumo."}
          </p>

          <div className="post-details__author-row">
            <div className="post-details__author-info">
              <div className="post-details__avatar">
                {getInitials(authorName)}
              </div>

              <div>
                <strong>{authorName}</strong>

                <div className="post-details__author-meta">
                  <span>
                    {formatPostDate(
                      post.createdAt,
                    )}
                  </span>

                  <span>
                    <Clock3 size={12} />

                    {readingTime}{" "}
                    {readingTime === 1
                      ? "min"
                      : "mins"}
                  </span>
                </div>
              </div>
            </div>

            <div className="post-details__actions">
              <button
                type="button"
                className={
                  likedByCurrentUser
                    ? "post-details__action post-details__action--liked"
                    : "post-details__action"
                }
                onClick={handleLike}
                disabled={isUpdatingLike}
                aria-label={
                  likedByCurrentUser
                    ? "Remover curtida"
                    : "Curtir artigo"
                }
                aria-pressed={
                  likedByCurrentUser
                }
              >
                <Heart
                  size={18}
                  fill={
                    likedByCurrentUser
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>

              <button
                type="button"
                className="post-details__action"
                aria-label="Salvar artigo"
              >
                <Bookmark size={18} />
              </button>

              <button
                type="button"
                className="post-details__action"
                onClick={handleShare}
                aria-label="Compartilhar artigo"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>

          <div className="post-details__stats">
            <span>
              <Heart size={13} />

              {likesCount}{" "}
              {likesCount === 1
                ? "curtida"
                : "curtidas"}
            </span>

            <span>
              <Eye size={13} />

              {views}{" "}
              {views === 1
                ? "visualização"
                : "visualizações"}
            </span>

            <span>
              <MessageSquare size={13} />

              {comments.length}{" "}
              {comments.length === 1
                ? "comentário"
                : "comentários"}
            </span>
          </div>
        </header>

        {bannerUrl && (
          <img
            src={bannerUrl}
            alt={`Imagem de capa do artigo ${post.title}`}
            className="post-details__image"
          />
        )}

        <section className="post-details__content">
          {paragraphs.length > 0 ? (
            paragraphs.map(
              (paragraph, index) => (
                <p
                  key={`${index}-${paragraph.slice(
                    0,
                    20,
                  )}`}
                >
                  {paragraph}
                </p>
              ),
            )
          ) : (
            <p>
              Este artigo ainda não possui
              conteúdo.
            </p>
          )}
        </section>

        {tags.length > 0 && (
          <section className="post-details__tags">
            {tags.map((tag, index) => (
              <span
                key={`${tag}-${index}`}
                className="post-details__tag"
              >
                {tag}
              </span>
            ))}
          </section>
        )}

        <section className="post-comments">
          <header className="post-comments__header">
            <h2>
              Comentário ({comments.length})
            </h2>
          </header>

          {!isAuthenticated ? (
            <div className="post-comments__login-card">
              <p>Faça login para comentar</p>

              <Link
                to="/login"
                className="post-comments__login-button"
              >
                Fazer login
              </Link>
            </div>
          ) : (
            <form
              className="post-comments__form-card"
              onSubmit={handleSubmitComment}
            >
              <label htmlFor="comment-content">
                Escreva um comentário
              </label>

              <textarea
                id="comment-content"
                value={commentContent}
                onChange={(event) => {
                  setCommentContent(event.target.value);

                  if (commentFormError) {
                    setCommentFormError("");
                  }
                }}
                placeholder="Compartilhe sua opinião..."
                maxLength={1000}
                disabled={isSubmittingComment}
              />

              <div className="post-comments__form-footer">
                <span>{commentContent.length}/1000</span>

                <button
                  type="submit"
                  disabled={
                    isSubmittingComment ||
                    commentContent.trim().length < 3
                  }
                >
                  <Send size={15} />
                  {isSubmittingComment
                    ? "Publicando..."
                    : "Publicar comentário"}
                </button>
              </div>

              {commentFormError && (
                <p className="post-comments__form-error">
                  {commentFormError}
                </p>
              )}
            </form>
          )}

          <div className="post-comments__list">
            {isLoadingComments && (
              <p className="post-comments__message">
                Carregando comentários...
              </p>
            )}

            {!isLoadingComments && commentsError && (
              <p className="post-comments__message post-comments__message--error">
                {commentsError}
              </p>
            )}

            {!isLoadingComments &&
              !commentsError &&
              comments.length === 0 && (
                <p className="post-comments__message">
                  Ainda não há comentários. Seja o primeiro a comentar.
                </p>
              )}

            {!isLoadingComments &&
              !commentsError &&
              comments.map((comment) => {
                const commentAuthorName =
                  comment.author?.name || "Usuário";

                const commentLikes =
                  comment.likesCount ?? 0;

                return (
                  <article
                    key={comment.id}
                    className="post-comment"
                  >
                    <div className="post-comment__top">
                      <div className="post-comment__author">
                        {comment.author?.avatar ? (
                          <img
                            src={comment.author.avatar}
                            alt={commentAuthorName}
                            className="post-comment__avatar-image"
                          />
                        ) : (
                          <div className="post-comment__avatar">
                            {getInitials(commentAuthorName)}
                          </div>
                        )}

                        <div className="post-comment__author-text">
                          <strong>{commentAuthorName}</strong>
                          <time dateTime={comment.createdAt}>
                            {formatPostDate(comment.createdAt)}
                          </time>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="post-comment__like"
                        aria-label="Curtir comentário"
                        title="Curtidas em comentários ainda não implementadas"
                      >
                        <Heart size={15} />
                        <span>{commentLikes}</span>
                      </button>
                    </div>

                    <p className="post-comment__content">
                      {comment.content}
                    </p>
                  </article>
                );
              })}
          </div>
        </section>
      </article>
    </main>
  );
}