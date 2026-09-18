import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import D20Roller from "../components/D20Roller";
import {
  IconShield,
  IconBook,
  IconCrown,
  IconArrowRight,
  IconUsers,
} from "../components/Icons";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* HERO */}
      <section className="hero hero-with-dice">
        <div className="hero-content">
          <p className="hero-eyebrow">Dungeons & Dragons 5-я редакция</p>
          <h1 className="hero-title">
            Ведите своих героев
            <br />
            сквозь тьму и пламя
          </h1>
          <p className="hero-subtitle">
            Управляйте персонажами, изучайте классы и готовьтесь к приключениям.
            Всё, что нужно Мастеру и игрокам — в одном месте.
          </p>
          <div className="hero-actions">
            <Link to="/" className="btn btn-primary">
              <IconShield size={16} />
              Мои персонажи
            </Link>
            <Link to="/classes" className="btn btn-outline">
              <IconBook size={16} />
              Классы
            </Link>
          </div>
        </div>

        <div className="hero-dice">
          <D20Roller size={340} />
        </div>
      </section>

      {/* STATS */}
      <section className="home-stats">
        <div className="home-stat">
          <div className="home-stat-value">12</div>
          <div className="home-stat-label">Базовых классов</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-value">20</div>
          <div className="home-stat-label">Уровней развития</div>
        </div>
        <div className="home-stat">
          <div className="home-stat-value">∞</div>
          <div className="home-stat-label">Возможностей</div>
        </div>
      </section>

      {/* CARDS */}
      <section className="home-section">
        <h2 className="section-title">С чего начать</h2>
        <div className="home-cards">
          <Link to="/" className="home-card">
            <div className="home-card-icon">
              <IconShield size={32} />
            </div>
            <h3>Персонажи</h3>
            <p>
              Создавайте героев, повышайте уровни и храните их истории.
              Только ваши записи — только ваш отряд.
            </p>
            <span className="home-card-link">
              Перейти <IconArrowRight size={16} />
            </span>
          </Link>

          <Link to="/classes" className="home-card">
            <div className="home-card-icon">
              <IconBook size={32} />
            </div>
            <h3>Классы</h3>
            <p>
              Двенадцать путей с полными таблицами прогрессии 1–20 уровня,
              умениями, костями хитов и ячейками заклинаний.
            </p>
            <span className="home-card-link">
              Изучить <IconArrowRight size={16} />
            </span>
          </Link>

          {user?.role === "admin" ? (
            <Link to="/admin" className="home-card">
              <div className="home-card-icon">
                <IconCrown size={32} />
              </div>
              <h3>Панель Мастера</h3>
              <p>
                Все персонажи и игроки мира. Обзор того, что происходит
                за пределами вашего отряда.
              </p>
              <span className="home-card-link">
                Открыть <IconArrowRight size={16} />
              </span>
            </Link>
          ) : (
            <div className="home-card home-card-static">
              <div className="home-card-icon">
                <IconUsers size={32} />
              </div>
              <h3>Отряд</h3>
              <p>
                Объединяйтесь с другими игроками, ведите chronicle приключений
                и делитесь историями героев.
              </p>
              <span className="home-card-link muted">Скоро</span>
            </div>
          )}
        </div>
      </section>

      {/* QUOTE */}
      <section className="home-quote">
        <blockquote>
          «Не все, кто странствует, потеряны. И не все, кто остаётся дома,
          находят покой.»
        </blockquote>
        <cite>— Из записей барда Торлина</cite>
      </section>
    </div>
  );
}