"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Music2, Loader2, Edit, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Mix {
  id: string;
  title: string;
  embedUrl: string;
  embedType: string;
  decade: string | null;
  isFeatured: boolean;
  isPublished: boolean;
}

const decadeLabels: Record<string, string> = {
  SEVENTIES: "70s",
  EIGHTIES: "80s",
  NINETIES: "90s",
  MIXED: "Mixed",
};

export default function MixesPage() {
  const [mixes, setMixes] = useState<Mix[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMixes();
  }, []);

  async function fetchMixes() {
    try {
      const res = await fetch("/api/mixes?all=true");
      if (!res.ok) throw new Error("Failed to fetch mixes");
      const data = await res.json();
      setMixes(data);
    } catch (error) {
      toast.error("Failed to load mixes");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteMix(id: string) {
    if (!confirm("Are you sure you want to delete this mix?")) return;

    try {
      const res = await fetch(`/api/mixes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete mix");
      setMixes(mixes.filter((m) => m.id !== id));
      toast.success("Mix deleted");
    } catch (error) {
      toast.error("Failed to delete mix");
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff0080]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Mixes</h1>
          <p className="text-white/60 mt-1">Manage your mix collection</p>
        </div>
        <Link
          href="/admin/mixes/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#ff0080] text-white font-medium rounded-lg hover:bg-[#ff0080]/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Mix
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mixes.map((mix) => (
          <div key={mix.id} className="glass rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#ff0080]/20 flex items-center justify-center">
                  <Music2 className="w-5 h-5 text-[#ff0080]" />
                </div>
                <div>
                  <h3 className="font-semibold line-clamp-1">{mix.title}</h3>
                  <p className="text-sm text-white/40 capitalize">{mix.embedType}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {mix.decade && (
                <span className="px-2 py-0.5 bg-white/10 text-white/60 text-xs rounded">
                  {decadeLabels[mix.decade]}
                </span>
              )}
              {mix.isFeatured && (
                <span className="px-2 py-0.5 bg-[#ff0080]/20 text-[#ff0080] text-xs rounded">
                  Featured
                </span>
              )}
              {!mix.isPublished && (
                <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                  Draft
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={mix.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link
                href={`/admin/mixes/${mix.id}`}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => deleteMix(mix.id)}
                className="p-2 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {mixes.length === 0 && (
          <div className="col-span-full glass rounded-xl p-8 text-center text-white/40">
            No mixes yet. Add your first mix.
          </div>
        )}
      </div>
    </div>
  );
}
