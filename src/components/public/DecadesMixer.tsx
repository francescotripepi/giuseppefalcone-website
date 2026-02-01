"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause } from "lucide-react";

const decades = [
  {
    id: "70s",
    year: "1970s",
    color: "#ffd000",
    gradient: "from-[#ffd000]/20 to-transparent",
    tracks: ["Stayin' Alive", "Disco Inferno", "I Will Survive", "September"],
    description: "Disco fever, funk grooves, and the birth of dance culture.",
    image: "/images/70s-bg.jpg",
  },
  {
    id: "80s",
    year: "1980s",
    color: "#ff0080",
    gradient: "from-[#ff0080]/20 to-transparent",
    tracks: ["Billie Jean", "Take On Me", "Sweet Dreams", "Blue Monday"],
    description: "Synth-pop revolution, new wave, and legendary anthems.",
    image: "/images/80s-bg.jpg",
  },
  {
    id: "90s",
    year: "1990s",
    color: "#00d4ff",
    gradient: "from-[#00d4ff]/20 to-transparent",
    tracks: ["Rhythm Is a Dancer", "Show Me Love", "Finally", "Groove Is in the Heart"],
    description: "House music explosion, eurodance, and rave culture peak.",
    image: "/images/90s-bg.jpg",
  },
];

export default function DecadesMixer() {
  const [activeDecade, setActiveDecade] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const currentDecade = decades[activeDecade];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    const index = Math.round(value * (decades.length - 1));
    setActiveDecade(index);
  };

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Dynamic Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDecade.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 -z-10"
        >
          <div
            className={`absolute inset-0 bg-gradient-radial ${currentDecade.gradient}`}
            style={{
              background: `radial-gradient(ellipse at center, ${currentDecade.color}15 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            Interactive Experience
          </p>
          <h2 className="text-4xl md:text-6xl font-bold">
            The <span className="text-gradient-neon">Decades</span> Mixer
          </h2>
          <p className="mt-4 text-white/60 max-w-2xl mx-auto">
            Slide through three legendary decades of dance music. Each era defined a generation.
          </p>
        </motion.div>

        {/* Mixer Container */}
        <div ref={containerRef} className="relative">
          {/* Decade Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDecade.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-12"
            >
              <motion.h3
                className="text-8xl md:text-[12rem] font-black tracking-tighter"
                style={{ color: currentDecade.color }}
              >
                {currentDecade.year}
              </motion.h3>
              <p className="text-lg text-white/70 mt-4 max-w-lg mx-auto">
                {currentDecade.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Timeline Slider */}
          <div ref={sliderRef} className="relative max-w-3xl mx-auto">
            {/* Decade Markers */}
            <div className="flex justify-between mb-4">
              {decades.map((decade, index) => (
                <button
                  key={decade.id}
                  onClick={() => setActiveDecade(index)}
                  className={`text-sm font-medium tracking-wide transition-all ${
                    activeDecade === index
                      ? "scale-110"
                      : "text-white/40 hover:text-white/60"
                  }`}
                  style={{ color: activeDecade === index ? decade.color : undefined }}
                >
                  {decade.id.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Slider Track */}
            <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full rounded-full"
                style={{ backgroundColor: currentDecade.color }}
                animate={{ width: `${(activeDecade / (decades.length - 1)) * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {/* Range Input */}
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={activeDecade / (decades.length - 1)}
              onChange={handleSliderChange}
              className="absolute top-0 left-0 w-full h-8 opacity-0 cursor-pointer"
              style={{ marginTop: "-12px" }}
            />

            {/* Slider Thumb */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 bg-[#0a0a0a]"
              style={{
                borderColor: currentDecade.color,
                boxShadow: `0 0 20px ${currentDecade.color}50`,
                left: `calc(${(activeDecade / (decades.length - 1)) * 100}% - 12px)`,
              }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>

          {/* Track List */}
          <motion.div
            layout
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {currentDecade.tracks.map((track, index) => (
              <motion.div
                key={track}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-4 rounded-lg group cursor-pointer hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${currentDecade.color}20` }}
                  >
                    <Play className="w-4 h-4" style={{ color: currentDecade.color }} />
                  </div>
                  <div>
                    <p className="font-medium text-sm line-clamp-1">{track}</p>
                    <p className="text-xs text-white/40">Classic Hit</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Audio Visualizer (Decorative) */}
          <div className="flex justify-center gap-1 mt-12">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full"
                style={{ backgroundColor: currentDecade.color }}
                animate={{
                  height: isPlaying ? [20, 40 + Math.random() * 30, 20] : 20,
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5 + Math.random() * 0.5,
                  delay: i * 0.05,
                }}
              />
            ))}
          </div>

          {/* Play Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-3 px-6 py-3 rounded-full border transition-all hover:scale-105"
              style={{
                borderColor: currentDecade.color,
                boxShadow: isPlaying ? `0 0 30px ${currentDecade.color}40` : "none",
              }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" style={{ color: currentDecade.color }} />
              ) : (
                <Play className="w-5 h-5" style={{ color: currentDecade.color }} />
              )}
              <span style={{ color: currentDecade.color }}>
                {isPlaying ? "Pause Vibes" : "Feel the Vibes"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
