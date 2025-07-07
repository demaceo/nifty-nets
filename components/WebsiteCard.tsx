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
    <article className="card group h-full flex flex-col">
      {/* Image Section */}
      <div className="relative overflow-hidden rounded-t-xl">
        <Image
          src={site.image || "/file.svg"}
          alt={site.title || site.url}
          width={600}
          height={200}
          className="w-full h-32 sm:h-40 lg:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ objectFit: "cover" }}
        />

        {/* Favorite Button Overlay */}
        <button
          onClick={toggleFav}
          className="absolute top-3 right-3 w-8 h-8 sm:w-10 sm:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xl sm:text-2xl transition-all hover:bg-white hover:scale-110 focus-ring"
          aria-label={favored ? "Remove from favorites" : "Add to favorites"}
        >
          {favored ? "⭐" : "☆"}
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow space-y-3 sm:space-y-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 leading-tight">
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-base sm:text-lg hover:text-indigo-600 transition-colors line-clamp-2"
          >
            {site.title || site.url}
          </a>
        </h3>

        {/* Description */}
        {site.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-grow">
            {site.description}
          </p>
        )}

        {/* Categories */}
        {site.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {site.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full capitalize"
              >
                {cat}
              </span>
            ))}
            {site.categories.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                +{site.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Video Source */}
        <div className="text-xs text-gray-500 border-t pt-3">
          <span className="font-medium">Video source: </span>
          <a
            href={site.videoSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            {new URL(site.videoSourceUrl).hostname}
          </a>
        </div>

        {/* Notes Section */}
        <div className="mt-auto space-y-2 sm:space-y-3">
          <textarea
            className="w-full text-sm focus-ring resize-none"
            placeholder="Add a personal note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />

          <button
            onClick={saveNote}
            className="w-full text-sm font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all"
          >
            💾 Save Note
          </button>
        </div>
      </div>
    </article>
  );
}
