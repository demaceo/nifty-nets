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
  const [form, setForm] = useState({
    url: "",
    videoSourceUrl: "",
    categories: [] as string[],
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

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    // Get admin key from environment or fallback
    const adminKey =
      process.env.NEXT_PUBLIC_ADMIN_KEY ||
      "658604870b3a9f0ea96aa289906e4df2e02e4379cc870693509191a046eeb798";

    console.log("Form data:", form);
    console.log("Admin key:", adminKey ? "Present" : "Missing");
    console.log("Environment:", process.env.NODE_ENV);

    try {
      console.log("Making API request to /api/websites...");

      const requestData = {
        url: form.url.trim(),
        videoSourceUrl: form.videoSourceUrl.trim(),
        categories: form.categories,
        notes: form.notes.trim() || null,
      };

      console.log("Request payload:", requestData);
      console.log("Request headers:", {
        "x-admin-key": adminKey ? "***PRESENT***" : "MISSING",
        "Content-Type": "application/json",
      });

      const response = await axios.post("/api/websites", requestData, {
        headers: {
          "x-admin-key": adminKey,
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      });

      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

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
    <form onSubmit={submit} className="space-y-6">
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
          onChange={(e) => setForm({ ...form, videoSourceUrl: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      {/* Categories */}
      <div className="form-group">
        <fieldset className="border-0 p-0 m-0" disabled={isLoading}>
          <legend className="form-label">Categories</legend>
          <div className="checkbox-grid">
            {allCats.map((cat) => (
              <label
                key={cat}
                className={`flex items-center space-x-2 p-3 rounded-lg border border-gray-600 bg-gray-800/50 hover:border-cyan-400 hover:bg-cyan-900/20 transition-all cursor-pointer ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                } ${
                  form.categories.includes(cat)
                    ? "border-cyan-400 bg-cyan-900/30"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.categories.includes(cat)}
                  onChange={() => !isLoading && toggleCat(cat)}
                  className="flex-shrink-0"
                  disabled={isLoading}
                />
                <span className="text-gray-200 font-medium capitalize text-sm sm:text-base">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label">Notes (Optional)</label>
        <textarea
          className="form-input min-h-[100px] resize-y"
          placeholder="Add any additional notes about this website..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={4}
          disabled={isLoading}
        />
      </div>

      {/* Test API Button and Submit Button */}
      <div className="pt-4 space-y-3">
        {/* Test API Button */}
        <button
          type="button"
          onClick={async () => {
            try {
              console.log("Testing minimal API endpoint...");

              // Test minimal API first
              const minimalResponse = await fetch("/api/minimal-test", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ test: "minimal" }),
              });
              const minimalData = await minimalResponse.json();
              console.log(
                "Minimal API test:",
                minimalResponse.status,
                minimalData
              );

              // Test simple API
              const simpleResponse = await fetch("/api/simple", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ test: "simple" }),
              });
              const simpleData = await simpleResponse.json();
              console.log(
                "Simple API test:",
                simpleResponse.status,
                simpleData
              );

              alert(
                `Minimal API: ${minimalResponse.status}\nSimple API: ${simpleResponse.status}\nCheck console for details.`
              );
            } catch (error) {
              console.error("API test failed:", error);
              alert(`API test failed: ${error}`);
            }
          }}
          className="btn-secondary w-full sm:w-auto sm:min-w-[200px]"
          disabled={isLoading}
        >
          🔧 Test API Connection
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className={`btn-primary w-full sm:w-auto sm:min-w-[200px] ${
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
            <>🚀 Save Website</>
          )}
        </button>
      </div>
    </form>
  );
}
