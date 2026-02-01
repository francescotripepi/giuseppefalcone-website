"use client";

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Share2, Copy, Check, X } from "lucide-react";

interface SharePosterProps {
  eventTitle?: string;
  eventDate?: string;
  eventVenue?: string;
}

export default function SharePoster({
  eventTitle = "Giuseppe Falcone Live",
  eventDate = "Coming Soon",
  eventVenue = "Your City",
}: SharePosterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generatePoster = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Set canvas size (Instagram story ratio)
    canvas.width = 1080;
    canvas.height = 1920;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#0a0a0a");
    gradient.addColorStop(0.5, "#1a0a1a");
    gradient.addColorStop(1, "#0a0a0a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add noise texture effect
    for (let i = 0; i < 50000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const alpha = Math.random() * 0.03;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Neon glow circle
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 - 200;
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 400);
    glowGradient.addColorStop(0, "rgba(255, 0, 128, 0.3)");
    glowGradient.addColorStop(0.5, "rgba(255, 0, 128, 0.1)");
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // "GIUSEPPE" text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 120px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GIUSEPPE", centerX, canvas.height / 2 - 100);

    // "FALCONE" text with dot
    ctx.fillText("FALCONE", centerX, canvas.height / 2 + 50);

    // Pink dot
    ctx.fillStyle = "#ff0080";
    ctx.beginPath();
    ctx.arc(centerX + 280, canvas.height / 2 - 20, 20, 0, Math.PI * 2);
    ctx.fill();

    // Decades line
    ctx.font = "bold 48px Arial";
    ctx.fillStyle = "#ffd000";
    ctx.fillText("70s", centerX - 150, canvas.height / 2 + 150);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("/", centerX - 50, canvas.height / 2 + 150);
    ctx.fillStyle = "#ff0080";
    ctx.fillText("80s", centerX, canvas.height / 2 + 150);
    ctx.fillStyle = "#ffffff";
    ctx.fillText("/", centerX + 100, canvas.height / 2 + 150);
    ctx.fillStyle = "#00d4ff";
    ctx.fillText("90s", centerX + 150, canvas.height / 2 + 150);

    // Event details
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px Arial";
    ctx.fillText(eventTitle, centerX, canvas.height / 2 + 350);

    ctx.font = "48px Arial";
    ctx.fillStyle = "#ff0080";
    ctx.fillText(eventDate, centerX, canvas.height / 2 + 450);

    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "36px Arial";
    ctx.fillText(eventVenue, centerX, canvas.height / 2 + 520);

    // Footer
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.font = "24px Arial";
    ctx.fillText("giuseppefalcone.com", centerX, canvas.height - 100);

    return canvas.toDataURL("image/png");
  }, [eventTitle, eventDate, eventVenue]);

  const handleDownload = async () => {
    const dataUrl = await generatePoster();
    if (!dataUrl) return;

    const link = document.createElement("a");
    link.download = `giuseppe-falcone-${eventTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${eventTitle} - Giuseppe Falcone`,
          text: `Check out ${eventTitle} by Giuseppe Falcone!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 glass rounded-full text-sm hover:bg-white/10 transition-colors"
      >
        <Share2 className="w-4 h-4" />
        Share This Vibe
      </button>

      {/* Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative glass rounded-xl p-6 max-w-md w-full"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold mb-6">Share This Vibe</h3>

            {/* Poster Preview */}
            <div className="aspect-[9/16] bg-gradient-to-b from-[#1a0a1a] to-[#0a0a0a] rounded-lg mb-6 flex items-center justify-center overflow-hidden">
              <div className="text-center">
                <p className="text-4xl font-bold">GIUSEPPE</p>
                <p className="text-4xl font-bold">
                  FALCONE<span className="text-[#ff0080]">.</span>
                </p>
                <p className="text-sm text-white/60 mt-4">{eventTitle}</p>
                <p className="text-[#ff0080] text-sm mt-1">{eventDate}</p>
              </div>
            </div>

            {/* Hidden Canvas for Generation */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#ff0080] text-white font-medium rounded-lg hover:bg-[#ff0080]/80 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-white/20 font-medium rounded-lg hover:bg-white/10 transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
