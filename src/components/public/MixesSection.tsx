"use client";

import { motion } from "framer-motion";
import { Play, ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Mix {
  id: string;
  title: string;
  description?: string | null;
  embedUrl: string;
  embedType: string;
  coverUrl?: string | null;
  decade?: string | null;
  duration?: number | null;
  isFeatured: boolean;
}

interface MixesSectionProps {
  mixes: Mix[];
  showAll?: boolean;
}

const decadeColors: Record<string, string> = {
  SEVENTIES: "#ffd000",
  EIGHTIES: "#ff0080",
  NINETIES: "#00d4ff",
  MIXED: "#ffffff",
};

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

export default function MixesSection({ mixes, showAll = false }: MixesSectionProps) {
  const displayMixes = showAll ? mixes : mixes.slice(0, 6);
  const featuredMix = mixes.find((m) => m.isFeatured);

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-transparent via-[#0f0a0f] to-transparent">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12"
        >
          <div>
            <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
              The Vault
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Mix <span className="text-gradient-neon">Collection</span>
            </h2>
          </div>
          {!showAll && mixes.length > 6 && (
            <Link
              href="/mixes"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              View All Mixes
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>

        {/* Featured Mix */}
        {featuredMix && !showAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="relative overflow-hidden rounded-xl glass">
              <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
                {/* Cover */}
                <div className="relative aspect-square md:aspect-auto rounded-lg overflow-hidden bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f]">
                  {featuredMix.coverUrl ? (
                    <img
                      src={featuredMix.coverUrl}
                      alt={featuredMix.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#ff0080]/20 flex items-center justify-center">
                          <Play className="w-8 h-8 text-[#ff0080]" />
                        </div>
                        <p className="text-white/40 text-sm">Featured Mix</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#ff0080] text-xs font-bold uppercase tracking-wider rounded">
                    Now Playing
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-col justify-center">
                  {featuredMix.decade && (
                    <span
                      className="text-xs font-bold uppercase tracking-wider mb-2"
                      style={{ color: decadeColors[featuredMix.decade] }}
                    >
                      {featuredMix.decade.replace("IES", "'s")}
                    </span>
                  )}
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {featuredMix.title}
                  </h3>
                  {featuredMix.description && (
                    <p className="text-white/60 mb-6 line-clamp-3">
                      {featuredMix.description}
                    </p>
                  )}
                  {featuredMix.duration && (
                    <p className="text-sm text-white/40 mb-6">
                      Duration: {formatDuration(featuredMix.duration)}
                    </p>
                  )}
                  <a
                    href={featuredMix.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff0080] text-white font-medium uppercase tracking-wide hover:bg-[#ff0080]/80 transition-colors w-fit"
                  >
                    <Play className="w-4 h-4" />
                    Listen Now
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Mixes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayMixes
            .filter((m) => !m.isFeatured || showAll)
            .map((mix, index) => (
              <motion.article
                key={mix.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="glass rounded-lg overflow-hidden hover:bg-white/5 transition-colors">
                  {/* Cover */}
                  <div className="relative aspect-square bg-gradient-to-br from-[#1f1f1f] to-[#0f0f0f]">
                    {mix.coverUrl ? (
                      <img
                        src={mix.coverUrl}
                        alt={mix.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play
                          className="w-12 h-12 text-white/20 group-hover:text-[#ff0080] transition-colors"
                        />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <a
                        href={mix.embedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 bg-[#ff0080] rounded-full hover:scale-110 transition-transform"
                      >
                        <Play className="w-6 h-6" />
                      </a>
                    </div>
                    {mix.decade && (
                      <div
                        className="absolute top-3 right-3 px-2 py-1 text-xs font-bold uppercase tracking-wider rounded"
                        style={{
                          backgroundColor: `${decadeColors[mix.decade]}20`,
                          color: decadeColors[mix.decade],
                        }}
                      >
                        {mix.decade === "SEVENTIES" ? "70s" :
                         mix.decade === "EIGHTIES" ? "80s" :
                         mix.decade === "NINETIES" ? "90s" : "Mixed"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold mb-1 group-hover:text-[#ff0080] transition-colors line-clamp-1">
                      {mix.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-white/40">
                      <span className="capitalize">{mix.embedType}</span>
                      {mix.duration && <span>{formatDuration(mix.duration)}</span>}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
        </div>
      </div>
    </section>
  );
}
