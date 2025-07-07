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
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

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
          NiftyNets
        </h1>

        {/* Search and Controls */}
        <div className="search-controls">
          <div className="controls-row">
            <input
              className="search-input"
              placeholder="Search websites..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="controls-group">
              <select
                className="sort-select"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
              >
                <option value="title">A → Z</option>
                <option value="createdAt">Newest</option>
              </select>
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={showFavs}
                  onChange={() => setShowFavs((f) => !f)}
                  className="filter-checkbox"
                />
                <span>⭐ Favorited</span>
              </label>
              <label className="filter-checkbox-label">
                <input
                  type="checkbox"
                  checked={showNotes}
                  onChange={() => setShowNotes((f) => !f)}
                  className="filter-checkbox"
                />
                <span>📝 Noted</span>
              </label>
            </div>
          </div>

          {/* Category Filters */}
          <div className="category-dropdown">
            <button
              className="category-dropdown-button"
              onClick={() => setShowCategoryDropdown((prev) => !prev)}
            >
              Filter by category
              {filterCats.length > 0 && (
                <span className="category-count-badge">
                  {filterCats.length}
                </span>
              )}
              <svg
                className={`category-dropdown-icon ${
                  showCategoryDropdown ? "open" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {showCategoryDropdown && (
              <div className="category-dropdown-menu">
                {allCats
                  .filter((cat) => cat !== "other")
                  .sort()
                  .concat("other")
                  .map((cat) => (
                    <label key={cat} className="category-option-label">
                      <input
                        type="checkbox"
                        checked={filterCats.includes(cat)}
                        onChange={() => toggleCat(cat)}
                        className="category-option-checkbox"
                      />
                      <span className="category-option-text">{cat}</span>
                    </label>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="results-grid">
        {filtered.length === 0 ? (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No websites found</h3>
            <p className="no-results-text">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="websites-grid">
            {filtered.map((site: any) => (
              <WebsiteCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
