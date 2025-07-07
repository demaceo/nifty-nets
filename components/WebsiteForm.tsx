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

  const submit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    await axios.post("/api/websites", form, {
      headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_KEY },
    });
    alert("Saved!");
    setForm({ url: "", videoSourceUrl: "", categories: [], notes: "" });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-gray-700">Site URL</label>
        <input
          className="w-full p-2 border rounded-lg"
          type="url"
          value={form.url}
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700">Video URL</label>
        <input
          className="w-full p-2 border rounded-lg"
          type="url"
          value={form.videoSourceUrl}
          onChange={(e) => setForm({ ...form, videoSourceUrl: e.target.value })}
          required
        />
      </div>
      <div>
        <legend className="text-gray-700 mb-1">Categories</legend>
        <div className="flex flex-wrap gap-2">
          {allCats.map((cat) => (
            <label key={cat} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={form.categories.includes(cat)}
                onChange={() => toggleCat(cat)}
                className="h-4 w-4"
              />
              <span className="text-gray-600 text-sm">{cat}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-gray-700">Notes</label>
        <textarea
          className="w-full p-2 border rounded-lg"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Save Website
      </button>
    </form>
  );
}
