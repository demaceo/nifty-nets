import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchMetadata } from "../lib/fetchMetadata";

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
  const [metadata, setMetadata] = useState({
    title: site.title,
    description: site.description,
    image: site.image,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const refreshMetadata = async () => {
    setIsRefreshing(true);
    try {
      const newMetadata = await fetchMetadata(site.url);
      setMetadata({
        title: newMetadata.title || site.title,
        description: newMetadata.description || site.description,
        image: newMetadata.image || site.image,
      });
    } catch (error) {
      console.error("Failed to refresh metadata:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <article className="website-card">
      {/* Image Section */}
      <div className="website-card-image-container">
        <Image
          src={metadata.image || "/file.svg"}
          alt={metadata.title || site.url}
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
            {metadata.title || site.url}
          </a>
          <button
            onClick={refreshMetadata}
            className="website-card-refresh-btn"
            disabled={isRefreshing}
            aria-label="Refresh metadata"
          >
            {isRefreshing ? "🔄" : "🔄"}
          </button>
        </h3>

        {/* Description */}
        {metadata.description && (
          <p className="website-card-description">{metadata.description}</p>
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
