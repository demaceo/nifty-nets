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
    <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col">
        <Image
          src={site.image || "/file.svg"}
          alt={site.title || site.url}
          width={600}
          height={160}
          className="w-full h-40 object-cover"
          style={{ objectFit: "cover" }}
        />

      <div className="p-4 flex flex-col flex-grow">
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg font-semibold text-gray-800 hover:underline mb-2"
        >
          {site.title || site.url}
        </a>

        {site.description && (
          <p className="text-gray-600 text-sm mb-4">{site.description}</p>
        )}

        <small className="text-gray-500 text-xs mb-4">
          Video:{" "}
          <a
            href={site.videoSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {new URL(site.videoSourceUrl).hostname}
          </a>
        </small>

        <div className="mt-auto space-y-2">
          <button
            onClick={toggleFav}
            className="text-2xl focus:outline-none"
            aria-label={favored ? "Unfavorite" : "Favorite"}
          >
            {favored ? "★" : "☆"}
          </button>

          <textarea
            className="w-full p-2 border rounded-lg text-sm"
            placeholder="Your note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
          />

          <button
            onClick={saveNote}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
