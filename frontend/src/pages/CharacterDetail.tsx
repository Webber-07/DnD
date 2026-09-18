import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api, Character } from "../api/client";
import { IconArrowLeft, IconEdit, IconTrash, IconShield } from "../components/Icons";

export default function CharacterDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [char, setChar] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!id) return;
    api
      .getCharacter(id)
      .then(setChar)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!char || !id) return;
    try {
      const updated = await api.updateCharacter(id, char);
      setChar(updated);
      setEditing(false);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm("Удалить персонажа навсегда?")) return;
    try {
      await api.deleteCharacter(id);
      navigate("/");
    } catch (e: any) {
      setError(e.message);
    }
  };

  if (loading) return <div className="page"><p className="muted">Загрузка...</p></div>;
  if (!char)
    return (
      <div className="page">
        <div className="error">{error || "Не найдено"}</div>
        <button className="btn btn-outline" onClick={() => navigate(-1)}>
          <IconArrowLeft size={16} /> Назад
        </button>
      </div>
    );

  return (
    <div className="page">
      <button className="back-link" onClick={() => navigate(-1)}>
        <IconArrowLeft size={16} /> Назад
      </button>

      {error && <div className="error">{error}</div>}

      {!editing ? (
        <div className="detail">
          <div className="detail-emblem">
            <IconShield size={56} />
          </div>
          <h1>{char.name}</h1>
          <div className="stats">
            <div><span className="label">Раса</span><span>{char.race}</span></div>
            <div><span className="label">Класс</span><span>{char.class}</span></div>
            <div><span className="label">Уровень</span><span>{char.level}</span></div>
          </div>
          <p className="desc">{char.description || "Нет предыстории..."}</p>
          <div className="actions">
            <button className="btn btn-primary" onClick={() => setEditing(true)}>
              <IconEdit size={16} /> Изменить
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              <IconTrash size={16} /> Удалить
            </button>
          </div>
        </div>
      ) : (
        <form className="char-form" onSubmit={handleUpdate}>
          <input value={char.name} onChange={(e) => setChar({ ...char, name: e.target.value })} />
          <div className="form-row">
            <input value={char.race} onChange={(e) => setChar({ ...char, race: e.target.value })} />
            <input value={char.class} onChange={(e) => setChar({ ...char, class: e.target.value })} />
            <input
              type="number"
              min={1}
              max={20}
              value={char.level}
              onChange={(e) => setChar({ ...char, level: Number(e.target.value) })}
            />
          </div>
          <textarea
            value={char.description}
            onChange={(e) => setChar({ ...char, description: e.target.value })}
          />
          <div className="actions">
            <button className="btn btn-primary">Сохранить</button>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}