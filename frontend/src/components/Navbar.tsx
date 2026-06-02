import { useState, useEffect, useRef } from "react";
import "../style/navbar.css";
import { useAuth } from "../context/Auth/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useSchedule } from "../context/WorkoutSecudule/SchduleContext";

const Navbar = () => {
  const { username, isAuthenticated, logout } = useAuth();
  const { addDay, schedule } = useSchedule();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handelLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddDay = () => {
    const existingNumbers = schedule.map((d) =>
      Number(d.day.replace("Day ", ""))
    );

    const nextNumber =
      Math.max(0, ...existingNumbers) + 1;

    addDay(`Day ${nextNumber}`);
  };

  return (
    <header className="navbar">
      <h1>🏋️ Workout Tracker</h1>

      <div className="navbar-actions">
        {isAuthenticated && (
          <button
            className="add-day-button"
            onClick={handleAddDay}
          >
            + Add Day
          </button>
        )}
      </div>

      <div className="profile" ref={menuRef}>
        {isAuthenticated ? (
          <>
            <img
              src="https://api.dicebear.com/9.x/thumbs/svg?seed=Profile"
              alt="profile"
              className="profile-img"
              onClick={() => setOpen((prev) => !prev)}
            />

            <span className="tooltip">Profile</span>

            {open && (
              <div className="dropdown-menu">
                <h3>{username}</h3>

                <button
                  className="sign-out-button"
                  onClick={handelLogout}
                >
                  Sign out
                </button>
              </div>
            )}
          </>
        ) : (
          <button
            className="navbar-login-button"
            onClick={
              location.pathname === "/register"
                ? handleLogin
                : handleRegister
            }
          >
            {location.pathname === "/register"
              ? "Login"
              : "Register"}
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;