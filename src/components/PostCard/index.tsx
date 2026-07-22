import {
  Clock3,
  Eye,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

import "./styles.css";

type PostCardProps = {
  id: number;
  title: string;
  summary: string;
  content: string;
  image?: string | null;
  category?: string | null;

  author?: {
    name: string;
  } | null;

  variant?: "featured" | "recent" | "list";
  createdAt: string;
  views?: number;
  likes?: number;
};

function formatPostDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Data indisponível";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function calculateReadingTime(content: string) {
  const normalizedContent = content?.trim() || "";

  if (!normalizedContent) {
    return 1;
  }

  const numberOfWords = normalizedContent
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(
    1,
    Math.ceil(numberOfWords / 200),
  );
}

function formatNumber(value?: number) {
  const safeValue =
    typeof value === "number" && Number.isFinite(value)
      ? value
      : 0;

  return new Intl.NumberFormat("pt-BR", {
    notation:
      safeValue >= 1000
        ? "compact"
        : "standard",
    maximumFractionDigits: 1,
  }).format(safeValue);
}

export function PostCard({
  id,
  title,
  summary,
  content,
  image,
  category,
  author,
  variant = "featured",
  createdAt,
  views = 0,
  likes = 0,
}: PostCardProps) {
  const readingTime =
    calculateReadingTime(content);

  const formattedDate =
    formatPostDate(createdAt);

  const authorName =
    author?.name || "Autor desconhecido";

  const shouldShowImage =
    (variant === "featured" ||
      variant === "list") &&
    Boolean(image);

  return (
    <article
      className={`post-card post-card--${variant}`}
    >
      {shouldShowImage && (
        <Link
          to={`/posts/${id}`}
          className="post-card__image-link"
          aria-label={`Abrir artigo ${title}`}
        >
          <img
            src={image || ""}
            alt={`Imagem de capa do artigo ${title}`}
            className="post-card__image"
          />
        </Link>
      )}

      <div className="post-card__body">
        <div className="post-card__meta">
          {category && (
            <span className="post-card__category">
              {category}
            </span>
          )}

          <time dateTime={createdAt}>
            {formattedDate}
          </time>
        </div>

        <Link
          to={`/posts/${id}`}
          className="post-card__title-link"
        >
          <h3 className="post-card__title">
            {title}
          </h3>
        </Link>

        <p className="post-card__summary">
          {summary}
        </p>

        <div className="post-card__footer">
          <span className="post-card__author">
            {authorName}
          </span>

          <div className="post-card__stats">
            <span
              className="post-card__stat"
              title={`Tempo estimado: ${readingTime} minutos`}
            >
              <Clock3
                size={14}
                aria-hidden="true"
              />

              {readingTime}{" "}
              {readingTime === 1
                ? "min"
                : "mins"}
            </span>

            <span
              className="post-card__stat"
              title={`${views} visualizações`}
            >
              <Eye
                size={14}
                aria-hidden="true"
              />

              {formatNumber(views)}
            </span>

            <span
              className="post-card__stat"
              title={`${likes} curtidas`}
            >
              <Heart
                size={14}
                aria-hidden="true"
              />

              {formatNumber(likes)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}