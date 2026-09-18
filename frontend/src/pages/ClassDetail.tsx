import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { classes, ClassAbility } from "../data/classes";
import { IconArrowLeft, IconBook, IconDice } from "../components/Icons";
import ClassProgression from "../components/ClassProgression";

type Tab = "description" | "abilities" | "progression";

function AbilityBlock({ ability }: { ability: ClassAbility }) {
  const hasDetails = ability.details && ability.details.length > 0;

  return (
    <article className="ability-article">
      <header className="ability-article-header">
        <h3 className="ability-article-title">{ability.name}</h3>
        <span className="ability-article-level">
          {ability.level}-й уровень, умение класса
        </span>
      </header>

      {!hasDetails ? (
        <p className="ability-article-text">{ability.description}</p>
      ) : (
        ability.details!.map((d, i) => (
          <div key={i} className="ability-detail">
            {d.subtitle && <h4 className="ability-detail-subtitle">{d.subtitle}</h4>}
            {d.text && <p className="ability-article-text">{d.text}</p>}
            {d.formula && <div className="ability-formula">{d.formula}</div>}
          </div>
        ))
      )}
    </article>
  );
}

export default function ClassDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [tab, setTab] = useState<Tab>("description");
  const cls = classes.find((c) => c.slug === slug);

  if (!cls) {
    return (
      <div className="page">
        <div className="error">Класс не найден: {slug}</div>
        <Link to="/classes" className="btn">
          <IconArrowLeft size={16} />
          К списку классов
        </Link>
      </div>
    );
  }

  const abilities = cls.abilities ?? [];
  const progression = cls.progression ?? [];

  return (
    <div className="page class-detail">
      <Link to="/classes" className="back-link">
        <IconArrowLeft size={16} />
        Все классы
      </Link>

      <header className="class-hero">
        <div className="class-hero-emblem">
          <IconBook size={44} />
        </div>
        <div>
          <h1>{cls.ru}</h1>
          <p className="class-en">{cls.en}</p>
          <p className="class-source">Источник: {cls.source}</p>
          {cls.role && <p className="class-role">{cls.role}</p>}
        </div>
      </header>

      <div className="class-stats">
        <div className="stat-box">
          <div className="stat-label">
            <IconDice size={14} />
            Кость хитов
          </div>
          <div className="stat-value">{cls.hitDie}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Основная характеристика</div>
          <div className="stat-value">{cls.primary}</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Спасброски</div>
          <div className="stat-value">{cls.saves}</div>
        </div>
      </div>

      <nav className="class-tabs">
        <button
          className={`class-tab ${tab === "description" ? "active" : ""}`}
          onClick={() => setTab("description")}
        >
          Описание
        </button>
        <button
          className={`class-tab ${tab === "abilities" ? "active" : ""}`}
          onClick={() => setTab("abilities")}
        >
          Умения
        </button>
        <button
          className={`class-tab ${tab === "progression" ? "active" : ""}`}
          onClick={() => setTab("progression")}
        >
          Таблица уровней
        </button>
      </nav>

      {tab === "description" && (
        <section className="class-section">
          <p className="class-full-desc">{cls.fullDesc}</p>

          <h2 className="class-subheading">Роль в партии</h2>
          <p className="class-body-text">{cls.role}</p>

          <h2 className="class-subheading">Основные характеристики</h2>
          <ul className="class-list">
            <li>
              <strong>Кость хитов:</strong> 1{cls.hitDie} за каждый уровень класса
            </li>
            <li>
              <strong>Основная характеристика:</strong> {cls.primary}
            </li>
            <li>
              <strong>Спасброски:</strong> {cls.saves}
            </li>
            <li>
              <strong>Источник:</strong> {cls.source}
            </li>
          </ul>
        </section>
      )}

      {tab === "abilities" && (
        <section className="class-section">
          {abilities.length === 0 ? (
            <p className="muted">Умения для этого класса ещё не описаны.</p>
          ) : (
            abilities.map((a, i) => <AbilityBlock key={i} ability={a} />)
          )}
        </section>
      )}

      {tab === "progression" && (
        <section className="class-section">
          {progression.length === 0 ? (
            <p className="muted">Таблица уровней пока не заполнена для этого класса.</p>
          ) : (
            <ClassProgression rows={progression} />
          )}
        </section>
      )}
    </div>
  );
}