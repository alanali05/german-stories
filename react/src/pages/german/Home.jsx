import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Clock, Search, X } from "lucide-react";
import storyone from "../../assets/storyone.png";

const stories = [
  { id: "simple-morning", titleDe: "Ein einfacher Morgen", titleKu: "سپێدەیەکا سادە", level: "A1", cover: storyone, readTime: "3 Min." },
];

const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const levelColors = {
  A1: "text-emerald-400 border-emerald-500/40",
  A2: "text-teal-400 border-teal-500/40",
  B1: "text-sky-400 border-sky-500/40",
  B2: "text-cyan-400 border-cyan-500/40",
  C1: "text-indigo-400 border-indigo-500/40",
  C2: "text-fuchsia-400 border-fuchsia-500/40"
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const filteredStories = useMemo(() => {
    let result = stories.filter((story) => {
      const searchLower = searchQuery.trim().toLowerCase();

      const matchesSearch =
        story.titleDe.toLowerCase().includes(searchLower) ||
        (story.titleKu && story.titleKu.includes(searchLower));

      const matchesLevel =
        selectedLevel === "all" || story.level === selectedLevel;

      return matchesSearch && matchesLevel;
    });

    return result.sort((a, b) => a.level.localeCompare(b.level));
  }, [searchQuery, selectedLevel]);

  return (
    <div className="min-h-screen w-full bg-[#0a0f1a] relative overflow-hidden pb-24">

      <div className="absolute -top-24 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-96 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 py-12 md:px-12">

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-full px-4 py-1.5 mb-4">
            <BookOpen size={16} className="text-cyan-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
              Geschichtenbibliothek
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Wähle eine Geschichte
          </h1>

          <p className="text-slate-400 mt-2">
            Wähle eine Geschichte zum Lesen, Anhören und Üben.
          </p>
        </div>

        <div className="mb-10 flex flex-col md:flex-row gap-4 md:items-center">

          <div className="relative flex-1 max-w-2xl">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nach deutschem oder kurdischem Titel suchen..."
              className="w-full h-11 pl-11 pr-10 bg-slate-900/60 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button
              onClick={() => setSelectedLevel("all")}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedLevel === "all"
                  ? "bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                  : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white"
              }`}
            >
              Alle Niveaus
            </button>

            {CEFR_LEVELS.map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedLevel === level
                    ? "bg-teal-500 text-white shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                    : "bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {filteredStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredStories.map((story) => {
              const colorClasses =
                levelColors[story.level] ||
                "text-slate-400 border-slate-500/40";

              return (
                <Link
                  key={story.id}
                  to={`/story/${story.id}`}
                  className="group relative block rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-[0_8px_24px_rgba(0,0,0,0.3)] hover:border-cyan-500/50 hover:shadow-[0_8px_32px_rgba(34,211,238,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="relative h-44 w-full overflow-hidden shrink-0">
                    <img
                      src={story.cover}
                      alt={story.titleDe}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/20 to-transparent" />

                    <span
                      className={`absolute top-3 left-3 rounded-lg border bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-xs font-bold ${colorClasses}`}
                    >
                      {story.level}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h2 className="text-white font-bold text-lg leading-tight group-hover:text-cyan-300 transition-colors">
                      {story.titleDe}
                    </h2>

                    {story.titleKu && (
                      <h3
                        dir="rtl"
                        className="text-slate-400 font-medium text-sm mt-1.5 opacity-80"
                      >
                        {story.titleKu}
                      </h3>
                    )}

                    <div className="flex-1" />

                    {story.readTime && (
                      <div className="flex items-center gap-1.5 mt-4 text-xs font-medium text-slate-500">
                        <Clock size={14} className="text-slate-600" />
                        <span>{story.readTime}</span>
                      </div>
                    )}
                  </div>

                  <div className="h-0.5 w-0 bg-gradient-to-r from-cyan-400 to-teal-400 group-hover:w-full transition-all duration-300 absolute bottom-0 left-0" />
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 rounded-2xl border border-slate-800 bg-slate-900/30 backdrop-blur-sm">
            <p className="text-slate-300 font-semibold text-lg">
              Keine Geschichten gefunden.
            </p>
            <p className="text-slate-500 text-sm mt-2">
              Versuche, deine Suche anzupassen oder ein anderes Niveau auszuwählen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}