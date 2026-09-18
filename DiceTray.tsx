interface DieResult {
  value: number;
  dropped: boolean;
}

interface GroupResult {
  id: number;
  dice: DieResult[];
  total: number;
}

interface Props {
  /** Финальные результаты. Пока null — идёт прокрутка */
  results: GroupResult[] | null;
  rolling: boolean;
  statLabels: string[];
}

function D6({ value, dropped, spinning }: { value: number; dropped: boolean; spinning: boolean }) {
  // Точки для каждой грани
  const dotsMap: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[30, 30], [70, 70]],
    3: [[30, 30], [50, 50], [70, 70]],
    4: [[30, 30], [70, 30], [30, 70], [70, 70]],
    5: [[30, 30], [70, 30], [50, 50], [30, 70], [70, 70]],
    6: [[30, 30], [70, 30], [30, 50], [70, 50], [30, 70], [70, 70]],
  };

  const dots = dotsMap[value] || dotsMap[1];

  return (
    <svg
      viewBox="0 0 100 100"
      width="42"
      height="42"
      className={`d6-svg ${spinning ? "spinning" : ""} ${dropped ? "dropped" : ""}`}
    >
      <rect
        x="6" y="6" width="88" height="88" rx="12"
        fill="#1c1712"
        stroke={dropped ? "#4a3a2a" : "#c9a55c"}
        strokeWidth="2.5"
      />
      {dots.map(([cx, cy], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="7"
          fill={dropped ? "#4a3a2a" : "#c9a55c"}
        />
      ))}
    </svg>
  );
}

export default function DiceTray({ results, rolling, statLabels }: Props) {
  // Пока rolling или нет результатов — показываем 6 групп по 4 куба со случайными значениями
  const groups: GroupResult[] =
    results ??
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      dice: Array.from({ length: 4 }, () => ({
        value: Math.floor(Math.random() * 6) + 1,
        dropped: false,
      })),
      total: 0,
    }));

  return (
    <div className={`dice-tray ${rolling ? "rolling" : ""} ${results ? "done" : ""}`}>
      <div className="dice-tray-groups">
        {groups.map((g, gi) => (
          <div key={g.id} className="dice-group">
            <div className="dice-group-label">{statLabels[gi]}</div>
            <div className="dice-group-dice">
              {g.dice.map((d, di) => (
                <D6
                  key={di}
                  value={d.value}
                  dropped={d.dropped}
                  spinning={rolling}
                />
              ))}
            </div>
            <div className="dice-group-total">
              {rolling ? "?" : droppedSum(g)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function droppedSum(g: GroupResult): number {
  const dropped = g.dice.find((d) => d.dropped);
  const sum = g.dice.reduce((a, b) => a + b.value, 0);
  return dropped ? sum - dropped.value : sum;
}