import { FormEvent, useEffect, useState } from "react";
import { api, Character, CharacterStats } from "../api/client";
import CharacterCard from "../components/CharacterCard";
import { IconPlus, IconShield } from "../components/Icons";
import StatsRoller, { Stats, STAT_KEYS } from "../components/StatsRoller";

const EMPTY_STATS: Stats = { str: 0, dex: 0, con: 0, int: 0, wis: 0, cha: 0 };

export default function Characters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    race: "Человек",
    class: "Воин",
    level: 1,
    description: "",
  });
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);

  const load = async () => {
    try {
      setLoading(true);
      const data = await api.getCharacters();
      setCharacters(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError("");

    if (!form.name.trim()) {
      setError("Введите имя персонажа");
      return;
    }

    // Проверяем, что все характеристики распределены (если бросали)
    const anyStat = STAT_KEYS.some((k) => stats[k] > 0);
    const allStats = STAT_KEYS.every((k) => stats[k] > 0);
    if (anyStat && !allStats) {
      setError("Распределите все характеристики до конца или сбросьте броски");
      return;
    }

    setSubmitting(true);
    try {
      const payload: any = { ...form };
      if (allStats) {
        payload.stats = stats as CharacterStats;
      }
      await api.createCharacter(payload);
      setForm({ name: "", race: "Человек", class: "Воин", level: 1, description: "" });
      setStats(EMPTY_STATS);
      setShowForm(false);
      await load();
    } catch (e: any) {
      setError(e.message || "Не удалось создать персонажа");
    } finally {
      setSubmitting(false);
    }
  };

  const cancelForm = () => {
    setForm({ name: "", race: "Человек", class: "Воин", level: 1, description: "" });
    setStats(EMPTY_STATS);
    setError("");
    setShowForm(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Мои персонажи</h1>
          <p className="muted">Ваш отряд и его истории</p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => (showForm ? cancelForm() : setShowForm(true))}
        >
          <IconPlus size={16} />
          {showForm ? "Отмена" : "Новый герой"}
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {showForm && (
        <form className="char-form" onSubmit={handleCreate}>
          <input
            type="text"
            placeholder="Имя персонажа"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            autoFocus
          />

          <div className="form-row">
            <select
              value={form.race}
              onChange={(e) => setForm({ ...form, race: e.target.value })}
            >
              {["Человек", "Эльф", "Дварф", "Полурослик", "Орк", "Тифлинг", "Драконорождённый"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={form.class}
              onChange={(e) => setForm({ ...form, class: e.target.value })}
            >
              {["Воин", "Волшебник", "Плут", "Жрец", "Паладин", "Варвар", "Бард", "Следопыт", "Друид", "Монах", "Чародей", "Колдун"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              max={20}
              value={form.level}
              onChange={(e) => setForm({ ...form, level: Number(e.target.value) })}
            />
          </div>

          <textarea
            placeholder="Предыстория персонажа..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <StatsRoller value={stats} onChange={setStats} />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Создание..." : "Создать"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="muted">Загрузка...</p>
      ) : characters.length === 0 ? (
        <div className="empty-state">
          <IconShield size={48} />
          <p>Пока нет персонажей.</p>
          <p className="muted">Создайте первого героя, чтобы начать приключение.</p>
        </div>
      ) : (
        <div className="grid">
          {characters.map((c) => (
            <CharacterCard key={c.id} char={c} />
          ))}
        </div>
      )}
    </div>
  );
}