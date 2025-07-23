import { useState } from "react";
import axios from "axios";

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

export default function WebsiteForm() {
  const [form, setForm] = useState<{
    url: string;
    videoSourceUrl: string;
    categories: string[];
    notes: string;
  }>({
    url: "",
    videoSourceUrl: "",
    categories: [],
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const toggleCat = (cat: string) =>
    setForm((s) => ({
      ...s,
      categories: s.categories.includes(cat)
        ? s.categories.filter((c) => c !== cat)
        : [...s.categories, cat],
    }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Get admin key from environment or fallback
    const adminKey =
      process.env.NEXT_PUBLIC_ADMIN_KEY ||
      "658604870b3a9f0ea96aa289906e4df2e02e4379cc870693509191a046eeb798";

    try {
      const requestData = {
        url: form.url.trim(),
        videoSourceUrl: form.videoSourceUrl.trim(),
        categories: form.categories,
        notes: form.notes.trim() || null,
      };

      const response = await axios.post("/api/websites", requestData, {
        headers: {
          "x-admin-key": adminKey,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });

      if (response.status === 201) {
        setSuccess("✅ Website saved successfully!");
        setForm({ url: "", videoSourceUrl: "", categories: [], notes: "" });

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: unknown) {
      console.error("Error saving website:", err);

      if (axios.isAxiosError(err)) {
        console.error("Axios error details:", {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
          url: err.config?.url,
          method: err.config?.method,
        });

        if (err.response?.status === 401) {
          setError("❌ Unauthorized. Please check your admin key.");
        } else if (err.response?.status === 400) {
          setError(
            "❌ " + (err.response.data?.error || "Invalid data provided.")
          );
        } else if (err.response?.status === 405) {
          setError(
            `❌ Method not allowed (405). The server received: ${err.config?.method?.toUpperCase()} ${
              err.config?.url
            }. Check Vercel deployment logs.`
          );
        } else if (err.response?.status === 500) {
          setError(
            "❌ " +
              (err.response.data?.error || "Server error. Please try again.")
          );
        } else if (err.code === "ECONNABORTED") {
          setError("❌ Request timeout. Please try again.");
        } else {
          setError(
            `❌ Failed to save website (${
              err.response?.status || "Unknown"
            }). Please check your connection and try again.`
          );
        }
      } else {
        console.error("Non-axios error:", err);
        setError("❌ An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={submit} className="form-content">
        {/* Status Messages */}
        {error && <div className="alert alert-error">{error}</div>}

        {success && <div className="alert alert-success">{success}</div>}

        {/* URL Input */}
        <div className="form-group">
          <label className="form-label">Website URL *</label>
          <input
            className="form-input"
            type="url"
            placeholder="https://example.com"
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        {/* Video URL Input */}
        <div className="form-group">
          <label className="form-label">Video Source URL *</label>
          <input
            className="form-input"
            type="url"
            placeholder="https://youtube.com/watch?v=..."
            value={form.videoSourceUrl}
            onChange={(e) =>
              setForm({ ...form, videoSourceUrl: e.target.value })
            }
            required
            disabled={isLoading}
          />
        </div>

        {/* Categories */}
        <div className="form-group">
          <fieldset className="checkbox-fieldset" disabled={isLoading}>
            <legend className="form-label">Categories</legend>
            <div className="checkbox-grid">
              {allCats.map((cat) => (
                <label
                  key={cat}
                  className={`checkbox-label ${
                    form.categories.includes(cat) ? "selected" : ""
                  } ${isLoading ? "disabled" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={form.categories.includes(cat)}
                    onChange={() => !isLoading && toggleCat(cat)}
                    className="checkbox-input"
                    disabled={isLoading}
                  />
                  <span className="checkbox-label">{cat}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes (Optional)</label>
          <textarea
            className="form-textarea"
            placeholder="Add any additional notes about this website..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            disabled={isLoading}
          />
        </div>

        {/* Test API Button and Submit Button */}
        <div className="form-actions">
          {/* Submit Button */}
          <button
            type="submit"
            className={`btn-primary ${
              isLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>Add Website</>
            )}
          </button>
          {/* Test API Button */}
          <button
            type="button"
            onClick={async () => {
              try {
                // Test minimal API first
                const minimalResponse = await fetch("/api/minimal-test", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ test: "minimal" }),
                });

                // Test simple API
                const simpleResponse = await fetch("/api/simple", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ test: "simple" }),
                });

                alert(
                  `Minimal API: ${minimalResponse.status}\nSimple API: ${simpleResponse.status}\nCheck console for details.`
                );
              } catch (error) {
                console.error("API test failed:", error);
                alert(`API test failed: ${error}`);
              }
            }}
            className="btn-secondary"
            disabled={isLoading}
          >
            🔧 Test API
          </button>
        </div>
      </form>
    </div>
  );
}
