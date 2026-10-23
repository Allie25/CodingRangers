import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiBookOpen, FiLogOut, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900"
        >
          <span className="rounded-xl bg-orange-500 p-2 text-white">
            <FiBookOpen />
          </span>
          Coding<span className="-ml-2 text-orange-500">Rangers</span>
        </Link>
        <div className="flex items-center gap-5 text-sm font-semibold text-slate-600">
          <NavLink to="/" className="hidden hover:text-orange-600 sm:block">
            Explore
          </NavLink>
          {user ? (
            <>
              <NavLink
                to={user.role === "admin" ? "/admin" : "/dashboard"}
                className="hover:text-orange-600"
              >
                Dashboard
              </NavLink>
              <span className="hidden items-center gap-1 md:flex">
                <FiUser />
                {user.name}
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="flex items-center gap-1 hover:text-orange-600"
              >
                <FiLogOut />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-600">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-orange-500 px-5 py-2.5 text-white hover:bg-orange-600"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
