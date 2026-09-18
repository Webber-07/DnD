import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  IconShield,
  IconBook,
  IconCrown,
  IconUser,
  IconLogout,
  IconHome,
} from "./Icons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <IconShield size={22} />
        <span>D&D Manager</span>
      </Link>

      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/home" className="nav-link">
              <IconHome size={16} />
              Главная
            </NavLink>
            <NavLink to="/" end className="nav-link">
              <IconShield size={16} />
              Персонажи
            </NavLink>
            <NavLink to="/classes" className="nav-link">
              <IconBook size={16} />
              Классы
            </NavLink>
            {user.role === "admin" && (
              <NavLink to="/admin" className="nav-link">
                <IconCrown size={16} />
                Админка
              </NavLink>
            )}

            <span className="user">
              <IconUser size={16} />
              {user.username}
            </span>

            <button onClick={handleLogout} className="btn btn-outline btn-sm">
              <IconLogout size={14} />
              Выйти
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="nav-link">Вход</NavLink>
            <NavLink to="/register" className="nav-link">Регистрация</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}