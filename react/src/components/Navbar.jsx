import { NavLink } from "react-router-dom";
import { BookOpen, Languages, Mail } from "lucide-react";
// UserCircle icon
const navItems = [
  { to: "/", label: "Geschichten", icon: BookOpen },
  { to: "/translator", label: "Übersetzer", icon: Languages },
  { to: "/contact", label: "Kontakt", icon: Mail },
];

export default function BottomNavbar() {
  // Ersetzen Sie dies mit Ihrer echten Authentifizierungsprüfung (Context, Redux, LocalStorage, etc.)
  // const isLoggedIn = !!localStorage.getItem("token");

  // const accountItem = {
  //   to: isLoggedIn ? "/profile" : "/login",
  //   label: isLoggedIn ? "Profil" : "Login",
  //   icon: UserCircle,
  // };

  const allItems = [...navItems,];

  return (
    <nav className="fixed bottom-4 inset-x-0 z-50 mx-auto w-[92%] max-w-md">
      <div className="flex items-center justify-around rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-3 py-2">
        {allItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-cyan-500/15 text-cyan-400"
                  : "text-slate-400 hover:text-slate-200"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.4 : 2}
                  className={isActive ? "drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" : ""}
                />
                <span className="text-[11px] font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}