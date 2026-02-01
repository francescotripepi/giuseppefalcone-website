"use client";

import { useEffect, useState } from "react";
import { Settings, Loader2, Save, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface SiteSettings {
  id: string;
  siteName: string;
  tagline: string | null;
  heroVideoUrl: string | null;
  heroImageUrl: string | null;
  contactEmail: string | null;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    soundcloud?: string;
    mixcloud?: string;
    youtube?: string;
    spotify?: string;
  } | null;
  analyticsId: string | null;
  maintenanceMode: boolean;
  bookingEnabled: boolean;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      if (res.status === 404) {
        setSettings({
          id: "",
          siteName: "Giuseppe Falcone",
          tagline: "",
          heroVideoUrl: "",
          heroImageUrl: "",
          contactEmail: "",
          socialLinks: {},
          analyticsId: "",
          maintenanceMode: false,
          bookingEnabled: true,
        });
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch settings");
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      toast.error("Failed to load settings");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveSettings() {
    if (!settings) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName: settings.siteName,
          tagline: settings.tagline || undefined,
          heroVideoUrl: settings.heroVideoUrl || undefined,
          heroImageUrl: settings.heroImageUrl || undefined,
          contactEmail: settings.contactEmail || undefined,
          socialLinks: settings.socialLinks,
          analyticsId: settings.analyticsId || undefined,
          maintenanceMode: settings.maintenanceMode,
          bookingEnabled: settings.bookingEnabled,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save settings");
      }

      const updated = await res.json();
      setSettings(updated);
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff0080]" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="text-center text-white/60 py-12">
        Failed to load settings data.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-white/60 mt-1">Configure your website settings</p>
        </div>
        <button
          onClick={saveSettings}
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
        {/* General Settings */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#ff0080]/20 flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#ff0080]" />
            </div>
            <h2 className="text-xl font-semibold">General</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline || ""}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
                placeholder="Master of 70s/80s/90s classics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail || ""}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
                placeholder="booking@giuseppefalcone.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Analytics ID (Google)
              </label>
              <input
                type="text"
                value={settings.analyticsId || ""}
                onChange={(e) => setSettings({ ...settings, analyticsId: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
                placeholder="G-XXXXXXXXXX"
              />
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Hero Video URL
              </label>
              <input
                type="url"
                value={settings.heroVideoUrl || ""}
                onChange={(e) => setSettings({ ...settings, heroVideoUrl: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Hero Image URL (fallback)
              </label>
              <input
                type="url"
                value={settings.heroImageUrl || ""}
                onChange={(e) => setSettings({ ...settings, heroImageUrl: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#ff0080]/50"
                placeholder="https://..."
              />
            </div>
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
                  value={(settings.socialLinks as Record<string, string>)?.[platform] || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
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

        {/* Feature Toggles */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Feature Toggles</h2>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer">
              <div>
                <span className="font-medium">Booking Enabled</span>
                <p className="text-sm text-white/40">Allow visitors to submit booking requests</p>
              </div>
              <input
                type="checkbox"
                checked={settings.bookingEnabled}
                onChange={(e) => setSettings({ ...settings, bookingEnabled: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-[#ff0080] focus:ring-[#ff0080]/50"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-white/5 rounded-lg cursor-pointer border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                <div>
                  <span className="font-medium">Maintenance Mode</span>
                  <p className="text-sm text-white/40">Show maintenance page to all visitors</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-yellow-500 focus:ring-yellow-500/50"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
