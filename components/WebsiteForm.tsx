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
  const toggleCat = (cat: string) =>
    setForm((s) => ({
      ...s,
      categories: s.categories.includes(cat)
        ? s.categories.filter((c) => c !== cat)
        : [...s.categories, cat],
    }));

  const submit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await axios.post("/api/websites", form, {
      headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY },
    });
    alert("Saved!");
    setForm({ url: "", videoSourceUrl: "", categories: [], notes: "" });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
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
        />
      </div>

      {/* Categories */}
      <div>
        <fieldset className="border-0 p-0 m-0">
          <legend className="block text-gray-700 font-medium mb-3">
            Categories
          </legend>
          <div className="checkbox-grid">
            {allCats.map((cat) => (
              <label
                key={cat}
                className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={form.categories.includes(cat)}
                  onChange={() => toggleCat(cat)}
                  className="flex-shrink-0"
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
        />
      </div>

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          className="w-full sm:w-auto sm:min-w-[200px] float"
        >
          🚀 Save Website
        </button>
      </div>
    </form>
  );
}
