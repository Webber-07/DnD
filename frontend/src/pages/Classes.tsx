import { Link } from "react-router-dom";
import { classes } from "../data/classes";
import { IconBook, IconArrowRight } from "../components/Icons";

export default function Classes() {
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Классы D&D 5e</h1>
          <p className="muted">Выберите путь своего героя — нажмите на карточку</p>
        </div>
      </div>

      <div className="class-grid">
        {classes.map((c) => (
          <Link to={`/classes/${c.slug}`} key={c.slug} className="class-card">
            <div className="class-card-head">
              <div className="class-card-emblem">
                <IconBook size={22} />
              </div>
              <div>
                <h3>{c.ru}</h3>
                <div className="en">{c.en}</div>
              </div>
            </div>

            <div className="meta">
              <div className="row">
                <span className="hit-die">{c.hitDie}</span>
                <span className="primary">{c.primary}</span>
              </div>
              <p className="class-desc">{c.shortDesc}</p>
              {c.role && <p className="class-role">{c.role}</p>}
              <div className="class-card-footer">
                <span className="source">{c.source}</span>
                <span className="class-card-arrow">
                  <IconArrowRight size={14} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}