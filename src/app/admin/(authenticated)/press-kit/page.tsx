"use client";

import { useEffect, useState } from "react";
import { FileText, Loader2, Save, Plus, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface PressKit {
  id: string;
  bioShort: string;
  bioLong: string | null;
  techRiderUrl: string | null;
  pressPhotosUrls: string[];
  socialLinks: {
    instagram?: string;
    facebook?: string;
    soundcloud?: string;
    mixcloud?: string;
    youtube?: string;
    spotify?: string;
  } | null;
  achievements: string[];
}

export default function PressKitPage() {
  const [pressKit, setPressKit] = useState<PressKit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newAchievement, setNewAchievement] = useState("");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");

  useEffect(() => {
    fetchPressKit();
  }, []);

  async function fetchPressKit() {
    try {
      const res = await fetch("/api/press-kit");
      if (res.status === 404) {
        // Initialize with defaults if not found
        setPressKit({
          id: "",
          bioShort: "",
          bioLong: "",
          techRiderUrl: "",
          pressPhotosUrls: [],
          socialLinks: {},
          achievements: [],
        });
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch press kit");
      const data = await res.json();
      setPressKit(data);
    } catch (error) {
      toast.error("Failed to load press kit");
    } finally {
      setIsLoading(false);
    }
  }

  async function savePressKit() {
    if (!pressKit) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/press-kit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bioShort: pressKit.bioShort,
          bioLong: pressKit.bioLong || undefined,
          techRiderUrl: pressKit.techRiderUrl || undefined,
          pressPhotosUrls: pressKit.pressPhotosUrls,
          socialLinks: pressKit.socialLinks,
          achievements: pressKit.achievements,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save press kit");
      }

      const updated = await res.json();
      setPressKit(updated);
      toast.success("Press kit saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save press kit");
    } finally {
      setIsSaving(false);
    }
  }

  function addAchievement() {
    if (!pressKit || !newAchievement.trim()) return;
    setPressKit({
      ...pressKit,
      achievements: [...pressKit.achievements, newAchievement.trim()],
    });
    setNewAchievement("");
  }

  function removeAchievement(index: number) {
    if (!pressKit) return;
    setPressKit({
      ...pressKit,
      achievements: pressKit.achievements.filter((_, i) => i !== index),
    });
  }

  function addPhotoUrl() {
    if (!pressKit || !newPhotoUrl.trim()) return;
    setPressKit({
      ...pressKit,
      pressPhotosUrls: [...pressKit.pressPhotosUrls, newPhotoUrl.trim()],
    });
    setNewPhotoUrl("");
  }

  function removePhotoUrl(index: number) {
    if (!pressKit) return;
    setPressKit({
      ...pressKit,
      pressPhotosUrls: pressKit.pressPhotosUrls.filter((_, i) => i !== index),
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff0080]" />
      </div>
    );
  }

  if (!pressKit) {
    return (
      <div className="text-center text-white/60 py-12">
        Failed to load press kit data.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Press Kit</h1>
          <p className="text-white/60 mt-1">Manage your electronic press kit (EPK)</p>
        </div>
        <button
          onClick={savePressKit}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-[#ff0080] text-white font-medium rounded-lg hover:bg-[#ff0080]/80 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* Bio Section */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#ff0080]/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#ff0080]" />
            </div>
            <h2 className="text-xl font-semibold">Biography</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Short Bio (for quick reference)
              </label>
              <textarea
                value={pressKit.bioShort}
                onChange={(e) => setPressKit({ ...pressKit, bioShort: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50 resize-none"
                placeholder="A brief bio (50+ characters)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Long Bio (detailed)
              </label>
              <textarea
                value={pressKit.bioLong || ""}
                onChange={(e) => setPressKit({ ...pressKit, bioLong: e.target.value })}
                rows={8}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50 resize-none"
                placeholder="Full biography for press releases..."
              />
            </div>
          </div>
        </div>

        {/* Technical Rider */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Technical Rider</h2>
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Tech Rider URL (PDF link)
            </label>
            <input
              type="url"
              value={pressKit.techRiderUrl || ""}
              onChange={(e) => setPressKit({ ...pressKit, techRiderUrl: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
              placeholder="https://example.com/tech-rider.pdf"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["instagram", "facebook", "soundcloud", "mixcloud", "youtube", "spotify"].map((platform) => (
              <div key={platform}>
                <label className="block text-sm font-medium text-white/60 mb-2 capitalize">
                  {platform}
                </label>
                <input
                  type="url"
                  value={(pressKit.socialLinks as Record<string, string>)?.[platform] || ""}
                  onChange={(e) =>
                    setPressKit({
                      ...pressKit,
                      socialLinks: {
                        ...pressKit.socialLinks,
                        [platform]: e.target.value,
                      },
                    })
                  }
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
                  placeholder={`https://${platform}.com/...`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Achievements</h2>
          <div className="space-y-3 mb-4">
            {pressKit.achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-lg"
              >
                <span>{achievement}</span>
                <button
                  onClick={() => removeAchievement(index)}
                  className="p-1 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newAchievement}
              onChange={(e) => setNewAchievement(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addAchievement()}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
              placeholder="Add an achievement..."
            />
            <button
              onClick={addAchievement}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Press Photos */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Press Photos</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {pressKit.pressPhotosUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Press photo ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => removePhotoUrl(index)}
                    className="p-2 bg-red-500/50 rounded-lg hover:bg-red-500/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="url"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPhotoUrl()}
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
              placeholder="Add photo URL..."
            />
            <button
              onClick={addPhotoUrl}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
