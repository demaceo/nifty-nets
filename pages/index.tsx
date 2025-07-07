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
      (s: { title: string; url: string | string[]; }) =>
        s.title?.toLowerCase().includes(search.toLowerCase()) ||
        s.url.includes(search)
    );
    if (filterCats.length) {
      list = list.filter((s: { categories: any[]; }) =>
        s.categories.some((c: string) => filterCats.includes(c))
      );
    }
    if (showFavs) {
      const favs = JSON.parse(localStorage.getItem("favs") || "[]");
      list = list.filter((s: { id: any; }) => favs.includes(s.id));
    }
    if (showNotes) {
      list = list.filter((s: { id: any; }) => localStorage.getItem(`note-${s.id}`));
    }
    return list.sort((a: { [x: string]: string; }, b: { [x: string]: any; }) => a[sortKey]?.localeCompare(b[sortKey]));
  }, [sites, search, filterCats, sortKey, showFavs, showNotes]);

  const toggleCat = (cat: string) =>
    setFilterCats((c) =>
      c.includes(cat) ? c.filter((x) => x !== cat) : [...c, cat]
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <input
            className="flex-grow p-2 border rounded-lg"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-2 border rounded-lg"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
          >
            <option value="title">A → Z</option>
            <option value="createdAt">Newest</option>
          </select>
          <button
            className={`p-2 rounded-lg ${
              showFavs ? "bg-yellow-300" : "bg-white"
            }`}
            onClick={() => setShowFavs((f) => !f)}
          >
            Favorites
          </button>
          <button
            className={`p-2 rounded-lg ${
              showNotes ? "bg-blue-300" : "bg-white"
            }`}
            onClick={() => setShowNotes((f) => !f)}
          >
            Notes
          </button>
        </div>
        <fieldset className="flex flex-wrap gap-2">
          {allCats.map((cat) => (
            <label key={cat} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={filterCats.includes(cat)}
                onChange={() => toggleCat(cat)}
                className="h-4 w-4"
              />
              <span className="text-gray-700 text-sm">{cat}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((site: any) => (
          <WebsiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  );
}
