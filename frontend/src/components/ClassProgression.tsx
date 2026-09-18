import { ProgressionRow } from "../data/classes";

export default function ClassProgression({ rows }: { rows: ProgressionRow[] }) {
  const hasSpells = rows.some((r) => r.slots && r.slots.some((s) => s !== null && s !== undefined));
  const hasCantrips = rows.some((r) => r.cantrips !== undefined && r.cantrips !== null);
  const hasSpellsKnown = rows.some((r) => r.spells !== undefined && r.spells !== null);

  return (
    <div className="progression-wrap">
      <table className="progression-table">
        <thead>
          <tr>
            <th rowSpan={2} className="th-level">Ур.</th>
            <th rowSpan={2} className="th-prof">Бонус<br />мастерства</th>
            <th rowSpan={2} className="th-features">Умения</th>
            {hasCantrips && <th rowSpan={2} className="th-num">Заговоры</th>}
            {hasSpellsKnown && <th rowSpan={2} className="th-num">Известно<br />заклинаний</th>}
            {hasSpells && <th colSpan={9} className="th-slots-group">Ячейки заклинаний на уровень</th>}
          </tr>
          {hasSpells && (
            <tr>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                <th key={n} className="th-slot">{n}</th>
              ))}
            </tr>
          )}
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.level}>
              <td className="cell-level">{r.level}</td>
              <td className="cell-prof">{r.profBonus}</td>
              <td className="cell-features">
                {r.features.length === 0 ? "—" : r.features.join(", ")}
              </td>
              {hasCantrips && <td className="cell-num">{r.cantrips ?? "—"}</td>}
              {hasSpellsKnown && <td className="cell-num">{r.spells ?? "—"}</td>}
              {hasSpells &&
                (r.slots ?? Array(9).fill(null)).map((s, i) => (
                  <td key={i} className="cell-slot">
                    {s === null || s === undefined ? "—" : s}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}