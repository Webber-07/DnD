import { useState, useRef, useEffect, DragEvent } from "react";
import { IconDice } from "./Icons";
import DiceTray from "./DiceTray";

export interface Stats {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export const STAT_KEYS: (keyof Stats)[] = ["str", "dex", "con", "int", "wis", "cha"];
export const STAT_LABELS: Record<keyof Stats, string> = {
  str: "СИЛ",
  dex: "ЛОВ",
  con: "ТЕЛ",
  int: "ИНТ",
  wis: "МДР",
  cha: "ХАР",
};

interface RolledSet {
  id: number;
  dice: { value: number; dropped: boolean }[];
  total: number;
}

function roll4d6kh3(): RolledSet {
  const values = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  const min = Math.min(...values);
  const droppedIdx = values.indexOf(min);
  const dice = values.map((v, i) => ({ value: v, dropped: i === droppedIdx }));
  const total = values.reduce((a, b) => a + b, 0) - min;
  return { id: Date.now() + Math.random(), dice, total };
}

export function modifier(value: number): number {
  return Math.floor((value - 10) / 2);
}

export function formatMod(m: number): string {
  return m >= 0 ? `+${m}` : `${m}`;
}

type PoolItem = { id: string; value: number };
type DragSource =
  | { kind: "pool"; itemId: string }
  | { kind: "stat"; statKey: keyof Stats };

interface Props {
  value: Stats;
  onChange: (s: Stats) => void;
  racialBonuses?: Partial<Stats>;
}

export default function StatsRoller({ value, onChange, racialBonuses = {} }: Props) {
  const [rolling, setRolling] = useState(false);
  const [showTray, setShowTray] = useState(false);
  const [animValues, setAnimValues] = useState<Record<keyof Stats, number> | null>(null);
  const [trayResults, setTrayResults] = useState<RolledSet[] | null>(null);
  const [rolled, setRolled] = useState<RolledSet[]>([]);
  const [pool, setPool] = useState<PoolItem[]>([]);
  const [dragSource, setDragSource] = useState<DragSource | null>(null);
  const [dragOverKey, setDragOverKey] = useState<keyof Stats | "pool" | null>(null);

  const intervalRef = useRef<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      timeoutsRef.current.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const roll = () => {
    if (rolling) return;

    setRolling(true);
    setShowTray(true);
    setTrayResults(null);
    setRolled([]);
    setPool([]);
    onChange({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });

    // Обновляем кубики на экране каждые 55 мс — они «крутятся»
    let ticks = 0;
    intervalRef.current = window.setInterval(() => {
      // Принудительно перерисовываем DiceTray со случайными значениями
      setTrayResults(null);
      ticks++;
      if (ticks > 20) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        finalize();
      }
    }, 55);
  };

  const finalize = () => {
    const results = Array.from({ length: 6 }, roll4d6kh3);
    setTrayResults(results);
    setRolled(results);
    setRolling(false);

    // Через 800 мс после показа кубиков — наполняем пул и убираем кубики
    const t1 = window.setTimeout(() => {
      const sorted = [...results].sort((a, b) => b.total - a.total);
      setPool(
        sorted.map((r, i) => ({ id: `pool-${Date.now()}-${i}`, value: r.total }))
      );
    }, 900);

    const t2 = window.setTimeout(() => {
      setShowTray(false);
      setTrayResults(null);
    }, 2200);

    timeoutsRef.current.push(t1, t2);
  };

  const reset = () => {
    setRolled([]);
    setPool([]);
    setTrayResults(null);
    setShowTray(false);
    onChange({ str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 });
  };

  // --- Drag & Drop ---
  const onDragStartPool = (e: DragEvent, item: PoolItem) => {
    setDragSource({ kind: "pool", itemId: item.id });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(item.value));
  };

  const onDragStartStat = (e: DragEvent, statKey: keyof Stats) => {
    if (value[statKey] <= 0) return;
    setDragSource({ kind: "stat", statKey });
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(value[statKey]));
  };

  const onDragEnd = () => {
    setDragSource(null);
    setDragOverKey(null);
  };

  const dropOnStat = (statKey: keyof Stats) => {
    if (!dragSource) return;

    if (dragSource.kind === "pool") {
      const item = pool.find((p) => p.id === dragSource.itemId);
      if (!item) return;
      const newPool = pool.filter((p) => p.id !== dragSource.itemId);
      const oldValue = value[statKey];
      if (oldValue > 0) {
        newPool.push({ id: `pool-${Date.now()}-back`, value: oldValue });
      }
      onChange({ ...value, [statKey]: item.value });
      setPool(newPool.sort((a, b) => b.value - a.value));
    }

    if (dragSource.kind === "stat") {
      const fromKey = dragSource.statKey;
      if (fromKey === statKey) return;
      onChange({
        ...value,
        [fromKey]: value[statKey],
        [statKey]: value[fromKey],
      });
    }

    setDragSource(null);
    setDragOverKey(null);
  };

  const dropOnPool = () => {
    if (!dragSource) return;
    if (dragSource.kind === "stat") {
      const statKey = dragSource.statKey;
      const v = value[statKey];
      if (v > 0) {
        onChange({ ...value, [statKey]: 0 });
        setPool((p) =>
          [...p, { id: `pool-${Date.now()}-ret`, value: v }].sort(
            (a, b) => b.value - a.value
          )
        );
      }
    }
    setDragSource(null);
    setDragOverKey(null);
  };

  const clearStat = (statKey: keyof Stats) => {
    const v = value[statKey];
    if (v <= 0) return;
    onChange({ ...value, [statKey]: 0 });
    setPool((p) =>
      [...p, { id: `pool-${Date.now()}-click`, value: v }].sort(
        (a, b) => b.value - a.value
      )
    );
  };

  const totalPoints = STAT_KEYS.reduce((sum, k) => sum + (value[k] || 0), 0);
  const allAssigned = STAT_KEYS.every((k) => value[k] > 0);

  return (
    <div className="stats-roller">
      <div className="stats-header">
        <h3>Характеристики</h3>
        <div className="stats-actions">
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={roll}
            disabled={rolling}
          >
            <IconDice size={14} />
            {rolling ? "Бросок..." : rolled.length ? "Перебросить 4d6" : "Бросить 4d6"}
          </button>
          {rolled.length > 0 && !rolling && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={reset}
            >
              Сброс
            </button>
          )}
        </div>
      </div>

      {/* Оверлей с кубиками */}
      {showTray && (
        <div className="dice-overlay">
          <div className="dice-overlay-inner">
            <h4 className="dice-overlay-title">
              {rolling ? "Бросок 4d6..." : "Результаты бросков"}
            </h4>
            <DiceTray
              results={trayResults}
              rolling={rolling}
              statLabels={STAT_KEYS.map((k) => STAT_LABELS[k])}
            />
            {!rolling && trayResults && (
              <p className="dice-overlay-hint">
                Наименьшая кость отброшена (зачёркнута). Сумма трёх остальных — в круге справа.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Обычный UI — скрыт пока крутятся кубики */}
      {!showTray && (
        <>
          {rolled.length === 0 ? (
            <p className="stats-hint">
              Нажмите «Бросить 4d6» — для каждой характеристики выпадет 4 кости,
              из которых отбрасывается наименьшая. Затем перетащите значения
              в нужные характеристики.
            </p>
          ) : (
            <>
              {/* Пул */}
              <div
                className={`stats-pool ${dragOverKey === "pool" ? "drag-over" : ""} ${
                  dragSource?.kind === "stat" ? "drop-target" : ""
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (dragSource?.kind === "stat") setDragOverKey("pool");
                }}
                onDragLeave={() => setDragOverKey(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  dropOnPool();
                }}
              >
                <div className="stats-pool-label">
                  {dragSource?.kind === "stat"
                    ? "Отпустите здесь, чтобы вернуть в пул"
                    : `Нераспределённые значения (${pool.length}):`}
                </div>
                <div className="stats-pool-values">
                  {pool.length === 0 ? (
                    <span className="muted">Все значения распределены</span>
                  ) : (
                    pool.map((item) => (
                      <span
                        key={item.id}
                        className="stat-chip"
                        draggable
                        onDragStart={(e) => onDragStartPool(e, item)}
                        onDragEnd={onDragEnd}
                        title="Перетащите на характеристику"
                      >
                        {item.value}
                        <span className="stat-chip-mod">
                          {formatMod(modifier(item.value))}
                        </span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Таблица */}
              <div className="stats-table-wrap">
                <table className="stats-table">
                  <thead>
                    <tr>
                      <th className="row-label">Хар-ка:</th>
                      {STAT_KEYS.map((k) => (
                        <th key={k}>{STAT_LABELS[k]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="row-label">Значение:</td>
                      {STAT_KEYS.map((k) => (
                        <td key={k}>
                          <div
                            className={`stat-drop-cell ${
                              dragOverKey === k ? "drag-over" : ""
                            } ${dragSource ? "droppable" : ""}`}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOverKey(k);
                            }}
                            onDragLeave={() => {
                              if (dragOverKey === k) setDragOverKey(null);
                            }}
                            onDrop={(e) => {
                              e.preventDefault();
                              dropOnStat(k);
                            }}
                            onClick={() => clearStat(k)}
                          >
                            <span
                              className={`stat-value ${
                                value[k] > 0 ? "filled" : "empty"
                              }`}
                              draggable={value[k] > 0}
                              onDragStart={(e) => onDragStartStat(e, k)}
                              onDragEnd={onDragEnd}
                            >
                              {value[k] > 0 ? value[k] : "—"}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="row-label">Бон. расы:</td>
                      {STAT_KEYS.map((k) => (
                        <td key={k} className="cell-num">
                          {formatMod(racialBonuses[k] ?? 0)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="row-label">Модиф.:</td>
                      {STAT_KEYS.map((k) => (
                        <td key={k} className="cell-num cell-mod">
                          {value[k] > 0
                            ? formatMod(modifier(value[k] + (racialBonuses[k] ?? 0)))
                            : "—"}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="row-label">Итого:</td>
                      {STAT_KEYS.map((k) => (
                        <td key={k} className="cell-num cell-total">
                          {value[k] > 0 ? value[k] + (racialBonuses[k] ?? 0) : "—"}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Детали бросков */}
              <details className="stats-details">
                <summary>Показать броски</summary>
                <div className="stats-rolls">
                  {rolled.map((r, i) => (
                    <div key={r.id} className="stat-roll">
                      <span className="stat-roll-num">#{i + 1}</span>
                      <div className="stat-roll-dice">
                        {r.dice.map((d, j) => (
                          <span
                            key={j}
                            className={`die ${d.dropped ? "die-dropped" : ""}`}
                          >
                            {d.value}
                          </span>
                        ))}
                      </div>
                      <span className="stat-roll-total">= {r.total}</span>
                    </div>
                  ))}
                </div>
              </details>

              <div className="stats-summary">
                <span>
                  Очки: <strong>{totalPoints}</strong> / распределено{" "}
                  {STAT_KEYS.filter((k) => value[k] > 0).length} из 6
                </span>
                {allAssigned && (
                  <span className="stats-ready">✓ Все характеристики назначены</span>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}