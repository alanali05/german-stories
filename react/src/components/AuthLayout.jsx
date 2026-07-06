export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-[#0a0f1a] flex items-center justify-center px-4 pb-28 py-12 relative overflow-hidden">
      {/* Ambient glow accents in the background */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] p-8">
          {title && (
            <h1 className="text-2xl font-bold text-white mb-1">{title}</h1>
          )}
          {subtitle && (
            <p className="text-slate-400 text-sm mb-7">{subtitle}</p>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
