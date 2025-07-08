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
    <article className="website-card">
      {/* Image Section */}
      <div className="website-card-image-container">
        <Image
          src={site.image || "/file.svg"}
          alt={site.title || site.url}
          width={300}
          height={100}
          className="website-card-image"
        />

        {/* Favorite Button Overlay */}
        <button
          onClick={toggleFav}
          className="website-card-favorite-btn"
          aria-label={favored ? "Remove from favorites" : "Add to favorites"}
        >
          {favored ? "⭐" : "☆"}
        </button>
      </div>

      {/* Content Section */}
      <div className="website-card-content">
        {/* Title */}
        <h3 className="website-card-title">
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="website-card-title-link"
          >
            {site.title || site.url}
          </a>
        </h3>

        {/* Description */}
        {site.description && (
          <p className="website-card-description">{site.description}</p>
        )}

        {/* Categories */}
        {site.categories.length > 0 && (
          <div className="website-card-categories">
            {site.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="website-card-category-tag"
                data-category={cat.toLowerCase()}
              >
                {cat}
              </span>
            ))}
            {site.categories.length > 3 && (
              <span className="website-card-category-more">
                +{site.categories.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Video Source */}
        <div className="website-card-video-source">
          <span className="website-card-video-source-label">
            Video Tutorial:{" "}
          </span>
          <a
            href={site.videoSourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="website-card-video-source-link"
          >
            {new URL(site.videoSourceUrl).hostname}
          </a>
        </div>

        {/* Notes Section */}
        <div className="website-card-notes">
          <textarea
            className="website-card-notes-textarea"
            placeholder="Add a personal note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />

          <button onClick={saveNote} className="website-card-save-btn">
            💾 Save Note
          </button>
        </div>
      </div>
    </article>
  );
}
