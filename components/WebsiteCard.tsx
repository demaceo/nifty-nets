import { useState, useEffect } from "react";
import Image from "next/image";

interface Website {
  id: string;
  url: string;
  videoSourceUrl: string;
  categories: string[];
  notes?: string;
  title?: string;
  description?: string;
  image?: string;
  createdAt: string;
}

interface WebsiteCardProps {
  site: Website;
}

const categoryColors: Record<string, string> = {
  coding: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
  creating: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  gaming: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  random: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  GenAI: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  educational: "bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300",
  informational: "bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300",
  useful: "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300",
  group: "bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300",
  other: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
};

export default function WebsiteCard({ site }: WebsiteCardProps) {
  const [favored, setFavored] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    // initialize favorite & note from localStorage
    const favs: string[] = JSON.parse(localStorage.getItem("favs") || "[]");
    setFavored(favs.includes(site.id));

    const storedNote = localStorage.getItem(`note-${site.id}`) || "";
    setNote(storedNote);
  }, [site.id]);

  const toggleFav = () => {
    const favs: string[] = JSON.parse(localStorage.getItem("favs") || "[]");
    let updated: string[];
    if (favs.includes(site.id)) {
      updated = favs.filter((id) => id !== site.id);
    } else {
      updated = [...favs, site.id];
    }
    localStorage.setItem("favs", JSON.stringify(updated));
    setFavored(!favored);
  };

  const saveNote = () => {
    localStorage.setItem(`note-${site.id}`, note);
  };

  return (
    <article className="card group h-full flex flex-col rounded-lg shadow-lg bg-white dark:bg-gray-800 transition-transform hover:scale-105">
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={site.image || "/file.svg"}
          alt={site.title || site.url}
          width={300}
          height={100}
          className="w-full h-32 sm:h-40 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Favorite Button Overlay */}
        <button
          onClick={toggleFav}
          className="absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 dark:bg-gray-700 backdrop-blur-sm rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-110 focus-ring"
          aria-label={favored ? "Remove from favorites" : "Add to favorites"}
        >
          {favored ? "⭐" : "☆"}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow space-y-3 sm:space-y-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 leading-tight">
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base sm:text-lg hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2"
          >
            {site.title || site.url}
          </a>
        </h3>

        {/* Description */}
        {site.description && (
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3 flex-grow">
            {site.description}
          </p>
        )}

        {/* Categories */}
        {site.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {site.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className={`px-2 py-1 text-xs font-medium rounded-full border border-gray-300 dark:border-gray-600 capitalize ${categoryColors[cat] || categoryColors.other}`}
              >
                {cat}
              </span>
            ))}
            {site.categories.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium rounded-full">
                +{site.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Video Source */}
        <div className="text-xs text-gray-500 dark:text-gray-400 border-t pt-3">
          <span className="font-medium">Video source: </span>
          <a
            href={site.videoSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-500 transition-colors"
          >
            {new URL(site.videoSourceUrl).hostname}
          </a>
        </div>

        {/* Notes Section */}
        <div className="mt-auto space-y-2 sm:space-y-3">
          <textarea
            className="w-full text-sm focus-ring resize-none bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg p-2"
            placeholder="Add a personal note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />

          <button
            onClick={saveNote}
            className="w-full text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all rounded-lg py-2"
          >
          Save Note
          </button>
        </div>
      </div>
    </article>
  );
}
