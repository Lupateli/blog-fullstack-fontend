import { Button } from "../../components/Button";
import { Button } from "../../components/Button";
import { Input } from "../../components/Input";

import "./styles.css";

const featuredArticles = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula.",
  },
  {
    id: 4,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula.",
  },
];
const recentArticles = [
  {
    id: 1,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula.",
  },
  {
    id: 4,
    title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam in augue ligula.",
  },
];
<section className="newsletter">
  <div className="newsletter__content">
    <div className="newsletter__icon">✉</div>

    <h2>Newsletter Semanal</h2>

    <p>
      Receba os melhores artigos de tecnologia diretamente no seu e-mail.
    </p>

    <form className="newsletter__form">
      <Input
        id="newsletter-email"
        type="email"
        label="Seu e-mail"
        placeholder="exemplo@email.com"
      />

      <Button type="submit">Inscrever-se</Button>
    </form>

    <small>
      Você pode cancelar sua inscrição a qualquer momento.
    </small>
  </div>
</section>

export function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero__content">
          <h1>
            Explore o Futuro da
            <span>Tecnologia</span>
          </h1>

          <p>
            Artigos sobre IA, desenvolvimento, DevOps e as últimas tendências
            tecnológicas.
          </p>

          <div className="hero__actions">
            <Button>Explorar Artigos</Button>

            <a href="#recentes" className="hero__secondary-action">
              Inscrever-se
            </a>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="home-container">
          <div className="section-header">
            <div>
              <h2>Artigos em Destaque</h2>
              <p>Os melhores conteúdos selecionados para você</p>
            </div>

            <a href="/artigos">Ver todos →</a>
          </div>

          <div className="featured__grid">
            {featuredArticles.map((article) => (
              <article className="article-card" key={article.id}>
                <div className="article-card__image">
                  <span>Lorem ipsum</span>
                </div>

                <div className="article-card__content">
                  <div className="article-card__meta">
                    <span>Desenvolvimento web</span>
                    <time>4 out 2025</time>
                  </div>

                  <h3>{article.title}</h3>

                  <p>{article.description}</p>

                  <div className="article-card__footer">
                    <span>John Doe</span>
                    <span>6 min · 122 · 1</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="recent" id="recentes">
        <div className="home-container">
            <div className="section-header">
            <div>
                <h2>Artigos Recentes</h2>
                <p>Conteúdo recente da comunidade</p>
            </div>
            </div>

            <div className="recent__grid">
            {recentArticles.map((article) => (
                <article className="recent-card" key={article.id}>
                <div className="recent-card__meta">
                    <span>Desenvolvimento web</span>
                    <time>4 out 2025</time>
                </div>

                <h3>{article.title}</h3>

                <p>{article.description}</p>

                <div className="recent-card__footer">
                    <span>John Doe</span>
                    <span>6 min · 122 · 1</span>
                </div>
                </article>
            ))}
            </div>
        </div>
        </section>
    </>
  );
}