import { useState } from "react";
import { NavLink } from "react-router";

const links = [
  { to: "/", label: "首頁" },
  { to: "/origin", label: "源起" },
  { to: "/staff", label: "工作人員" },
  { to: "/tickets", label: "售票資訊" },
  { to: "/agenda", label: "議程" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b accent-border z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center gap-6">
        <NavLink
          to="/"
          className="font-bold text-base md:text-lg tracking-wider"
        >
          第二屆亞太禁羈研討會 (A.S.K. II)
        </NavLink>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden cursor-pointer p-1 -mr-1 text-gray-700 select-none"
          aria-label="開啟選單"
          aria-expanded={open}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <div
          className={`${
            open ? "flex" : "hidden"
          } flex-col items-start absolute top-full inset-x-0 bg-white/95 backdrop-blur-sm border-b accent-border px-6 py-4 gap-4 md:flex md:flex-row md:items-center md:static md:inset-auto md:bg-transparent md:backdrop-blur-none md:border-0 md:p-0 md:gap-6 text-sm md:text-base`}
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "text-gray-900 hover:text-black font-medium border-b-2 border-emerald-500 pb-1"
                  : "text-gray-500 hover:text-black font-medium"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
