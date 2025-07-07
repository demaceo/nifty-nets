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

    try {
      const response = await axios.post("/api/websites", form, {
        headers: {
          "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY,
          "Content-Type": "application/json",
        },
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
        if (err.response?.status === 401) {
          setError("❌ Unauthorized. Please check your admin key.");
        } else if (err.response?.status === 400) {
          setError(
            "❌ " + (err.response.data?.error || "Invalid data provided.")
          );
        } else if (err.response?.status === 500) {
          setError(
            "❌ " +
              (err.response.data?.error || "Server error. Please try again.")
          );
        } else {
          setError(
            "❌ Failed to save website. Please check your connection and try again."
          );
        }
      } else {
        setError("❌ An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Status Messages */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      {/* URL Input */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Website URL *
        </label>
        <input
          className="w-full focus-ring"
          type="url"
          placeholder="https://example.com"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      {/* Video URL Input */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Video Source URL *
        </label>
        <input
          className="w-full focus-ring"
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={form.videoSourceUrl}
          onChange={(e) => setForm({ ...form, videoSourceUrl: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      {/* Categories */}
      <div>
        <fieldset className="border-0 p-0 m-0" disabled={isLoading}>
          <legend className="block text-gray-700 font-medium mb-3">
            Categories
          </legend>
          <div className="checkbox-grid">
            {allCats.map((cat) => (
              <label
                key={cat}
                className={`flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.categories.includes(cat)}
                  onChange={() => !isLoading && toggleCat(cat)}
                  className="flex-shrink-0"
                  disabled={isLoading}
                />
                <span className="text-gray-700 font-medium capitalize text-sm sm:text-base">
                  {cat}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Notes (Optional)
        </label>
        <textarea
          className="w-full focus-ring min-h-[100px] resize-y"
          placeholder="Add any additional notes about this website..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          rows={4}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className={`w-full sm:w-auto sm:min-w-[200px] ${
            isLoading ? "opacity-75 cursor-not-allowed" : "float"
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
