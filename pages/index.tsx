/* eslint-disable @typescript-eslint/no-explicit-any */
import useSWR from "swr";
import WebsiteCard from "@/components/WebsiteCard";
import { useState, useMemo } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const allCats = [
  "coding",
  "creating",
  "gaming",
  "random",
  "GenAI",
  "educational",
  "informational",
  "useful",
  "group",
  "other",
];

export default function Home() {
  const { data: sites } = useSWR("/api/websites", fetcher);
  const [search, setSearch] = useState("");
  const [filterCats, setFilterCats] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<"title" | "createdAt">("title");
  const [showFavs, setShowFavs] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const filtered = useMemo(() => {
    if (!sites) return [];
    let list = sites.filter(
      (s: { title: string; url: string | string[] }) =>
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.url.includes(search)
    );
    if (filterCats.length) {
      list = list.filter((s: { categories: any[] }) =>
        s.categories.some((c: string) => filterCats.includes(c))
      );
    }
    if (showFavs) {
      const favs = JSON.parse(localStorage.getItem("favs") || "[]");
      list = list.filter((s: { id: any }) => favs.includes(s.id));
    }
    if (showNotes) {
      list = list.filter((s: { id: any }) =>
        localStorage.getItem(`note-${s.id}`)
      );
    }
    return list.sort((a: { [x: string]: string }, b: { [x: string]: any }) =>
      a[sortKey]?.localeCompare(b[sortKey])
    );
  }, [sites, search, filterCats, sortKey, showFavs, showNotes]);

  const toggleCat = (cat: string) =>
    setFilterCats((c) =>
      c.includes(cat) ? c.filter((x) => x !== cat) : [...c, cat]
    );

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-6 lg:mb-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6 lg:mb-8">
          Nifty Net
        </h1>

        {/* Search and Controls */}
        <div className="glass p-4 sm:p-6 rounded-2xl mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
            <input
              className="flex-grow min-w-0 focus-ring"
              placeholder="Search websites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <select
                className="focus-ring min-w-0 sm:min-w-[120px]"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
              >
                <option value="title">A → Z</option>
                <option value="createdAt">Newest</option>
              </select>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showFavs
                    ? "bg-yellow-400 text-yellow-900 shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white"
                }`}
                onClick={() => setShowFavs((f) => !f)}
              >
                ⭐ Favorites
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  showNotes
                    ? "bg-blue-400 text-blue-900 shadow-lg"
                    : "bg-white/80 text-gray-700 hover:bg-white"
                }`}
                onClick={() => setShowNotes((f) => !f)}
              >
                📝 Notes
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="text-sm font-medium text-gray-700 mb-3 px-1">
              Filter by category:
            </legend>
            <div className="checkbox-grid">
              {allCats.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={filterCats.includes(cat)}
                    onChange={() => toggleCat(cat)}
                    className="flex-shrink-0"
                  />
                  <span className="text-gray-700 text-sm font-medium capitalize">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No websites found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
            {filtered.map((site: any) => (
              <WebsiteCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
