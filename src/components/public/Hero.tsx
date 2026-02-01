"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Volume2, VolumeX, ChevronDown } from "lucide-react";
import Link from "next/link";

interface HeroProps {
  videoUrl?: string;
  imageUrl?: string;
}

export default function Hero({ videoUrl, imageUrl }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Video/Image */}
      {videoUrl ? (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={imageUrl}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 video-overlay" />
      <div className="absolute inset-0 gradient-mesh opacity-50" />

      {/* Noise Texture */}
      <div className="absolute inset-0 noise-overlay" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Subtitle */}
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-white/60">
            The Sound of Three Decades
          </p>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tight">
            <span className="text-gradient">GIUSEPPE</span>
            <br />
            <span className="relative">
              FALCONE
              <span className="absolute -right-4 -top-2 text-[#ff0080] text-6xl md:text-8xl lg:text-9xl">
                .
              </span>
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto font-light">
            Master of <span className="text-[#ffd000]">70s</span> /{" "}
            <span className="text-[#ff0080]">80s</span> /{" "}
            <span className="text-[#00d4ff]">90s</span> classics
          </p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link
              href="/booking"
              className="px-8 py-4 bg-[#ff0080] text-white font-medium tracking-wide uppercase hover:bg-[#ff0080]/80 transition-all hover:scale-105 neon-glow"
            >
              Book Now
            </Link>
            <Link
              href="/mixes"
              className="px-8 py-4 border border-white/20 text-white font-medium tracking-wide uppercase hover:bg-white/10 transition-all"
            >
              Listen to Mixes
            </Link>
          </motion.div>
        </motion.div>

        {/* Video Controls */}
        {videoUrl && (
          <div className="absolute bottom-32 left-6 flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? "Pause video" : "Play video"}
            >
              <Play className={`w-4 h-4 ${isPlaying ? "hidden" : "block"}`} />
              <div className={`w-4 h-4 flex gap-1 ${isPlaying ? "flex" : "hidden"}`}>
                <div className="w-1 h-full bg-white" />
                <div className="w-1 h-full bg-white" />
              </div>
            </button>
            <button
              onClick={toggleMute}
              className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        )}

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
