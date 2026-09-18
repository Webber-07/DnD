import { Link } from "react-router-dom";
import { Character } from "../api/client";
import { IconShield } from "./Icons";
import { STAT_KEYS, STAT_LABELS, modifier, formatMod } from "./StatsRoller";

export default function CharacterCard({ char }: { char: Character }) {
  return (
    <Link to={`/characters/${char.id}`} className="card">
      <div className="card-emblem">
        <IconShield size={26} />
      </div>
      <h3>{char.name}</h3>
      <p className="muted">{char.race} · {char.class}</p>
      <p className="level">Уровень {char.level}</p>

      {char.stats && (
        <div className="card-stats">
          {STAT_KEYS.map((k) => {
            const v = char.stats![k];
            const m = modifier(v);
            return (
              <div key={k} className="card-stat">
                <span className="card-stat-label">{STAT_LABELS[k]}</span>
                <span className="card-stat-value">{v}</span>
                <span className="card-stat-mod">{formatMod(m)}</span>
              </div>
            );
          })}
        </div>
      )}
    </Link>
  );
}
