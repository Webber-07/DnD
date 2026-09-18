import { useState, useRef, useEffect } from "react";

interface Roll {
  id: number;
  value: number;
  time: string;
  isCrit: boolean;
  isCritFail: boolean;
}

export default function D20Roller({ size = 320 }: { size?: number }) {
  const [rolling, setRolling] = useState(false);
  const [currentValue, setCurrentValue] = useState<number | null>(null);
  const [history, setHistory] = useState<Roll[]>([]);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    setCurrentValue(null);

    // Быстрая смена чисел 1.2 сек
    let ticks = 0;
    intervalRef.current = window.setInterval(() => {
      setCurrentValue(Math.floor(Math.random() * 20) + 1);
      ticks++;
      if (ticks > 18) {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
        finalizeRoll();
      }
    }, 60);
  };

  const finalizeRoll = () => {
    const value = Math.floor(Math.random() * 20) + 1;
    setCurrentValue(value);
    setRolling(false);

    const newRoll: Roll = {
      id: Date.now(),
      value,
      time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      isCrit: value === 20,
      isCritFail: value === 1,
    };
    setHistory((h) => [newRoll, ...h].slice(0, 6));
  };

  const displayValue = currentValue ?? 20;
  const isCrit = !rolling && currentValue === 20;
  const isCritFail = !rolling && currentValue === 1;

  const strokeOuter = isCrit ? "#e5c78a" : isCritFail ? "#c94a4a" : "#c9a55c";
  const strokeInner = isCrit ? "#c9a55c" : isCritFail ? "#7a1f1f" : "#7a1f1f";

  return (
    <div className="d20-block">
      <button
        className={`d20-svg-wrap ${rolling ? "rolling" : ""} ${isCrit ? "crit" : ""} ${isCritFail ? "crit-fail" : ""}`}
        onClick={roll}
        aria-label="Бросить d20"
        type="button"
      >
        <svg viewBox="0 0 240 240" width={size} height={size}>
          <defs>
            <radialGradient id="d20glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c9a55c" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#c9a55c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {isCrit && <circle cx="120" cy="120" r="115" fill="url(#d20glow)" />}

          {/* внешнее кольцо */}
          <circle cx="120" cy="120" r="105" fill="none" stroke={strokeOuter} strokeWidth="1.5" opacity="0.75" />

          {/* шестиугольник */}
          <polygon
            points="120,25 190,70 190,170 120,215 50,170 50,70"
            fill="none"
            stroke={strokeOuter}
            strokeWidth="2"
            opacity="0.9"
          />

          {/* пятиугольник */}
          <polygon
            points="120,55 170,85 170,155 120,185 70,155 70,85"
            fill="none"
            stroke={strokeInner}
            strokeWidth="1.2"
            opacity="0.7"
          />

          {/* число */}
          <text
            x="120"
            y="140"
            textAnchor="middle"
            fontFamily="'Times New Roman', Georgia, serif"
            fontSize="72"
            fontWeight="700"
            fill={strokeOuter}
            style={{ transition: "fill 0.2s" }}
          >
            {displayValue}
          </text>
        </svg>

        <div className="d20-label">
          {rolling && "Бросок..."}
          {!rolling && currentValue === null && "Нажмите, чтобы бросить d20"}
          {!rolling && isCrit && "КРИТИЧЕСКИЙ УСПЕХ!"}
          {!rolling && isCritFail && "КРИТИЧЕСКИЙ ПРОВАЛ"}
          {!rolling && currentValue !== null && !isCrit && !isCritFail && `Результат: ${currentValue}`}
        </div>
      </button>

      {history.length > 0 && (
        <div className="d20-history">
          <div className="d20-history-title">История бросков</div>
          <div className="d20-history-list">
            {history.map((r) => (
              <div
                key={r.id}
                className={`d20-history-item ${r.isCrit ? "crit" : ""} ${r.isCritFail ? "crit-fail" : ""}`}
              >
                <span className="d20-history-value">{r.value}</span>
                <span className="d20-history-time">{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}