import { useEffect, useState } from "react";
import { api, AdminCharacter, AdminUser } from "../api/client";
import { IconShield, IconUser, IconCrown } from "../components/Icons";

export default function AdminPanel() {
  const [characters, setCharacters] = useState<AdminCharacter[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"chars" | "users">("chars");

  useEffect(() => {
    Promise.all([api.getAllCharacters(), api.getAllUsers()])
      .then(([chars, usrs]) => {
        setCharacters(chars);
        setUsers(usrs);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><p className="muted">Загрузка...</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Панель Мастера</h1>
          <p className="muted">Полный обзор мира</p>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="tabs">
        <button
          className={`tab ${tab === "chars" ? "active" : ""}`}
          onClick={() => setTab("chars")}
        >
          Персонажи ({characters.length})
        </button>
        <button
          className={`tab ${tab === "users" ? "active" : ""}`}
          onClick={() => setTab("users")}
        >
          Игроки ({users.length})
        </button>
      </div>

      {tab === "chars" && (
        <div className="grid">
          {characters.length === 0 ? (
            <p className="muted">Пока нет персонажей</p>
          ) : (
            characters.map((c) => (
              <div key={c.id} className="card admin-card">
                <div className="card-emblem">
                  <IconShield size={26} />
                </div>
                <h3>{c.name}</h3>
                <p className="muted">{c.race} · {c.class}</p>
                <p className="level">Уровень {c.level}</p>
                <p className="owner">Владелец: {c.ownerName}</p>
              </div>
            ))
          )}
        </div>
      )}

      {tab === "users" && (
        <div className="grid">
          {users.map((u) => (
            <div key={u.id} className="card admin-card">
              <div className="card-emblem">
                {u.role === "admin" ? <IconCrown size={26} /> : <IconUser size={26} />}
              </div>
              <h3>{u.username}</h3>
              <p className="muted">{u.role === "admin" ? "Мастер" : "Игрок"}</p>
              <p className="level">Персонажей: {u.characterCount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
