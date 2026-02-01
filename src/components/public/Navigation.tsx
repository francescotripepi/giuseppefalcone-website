"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, Music2, Youtube, Mail } from "lucide-react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/mixes", label: "Mixes" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/epk", label: "EPK" },
  { href: "/booking", label: "Book Now" },
];

const socialLinks = [
  { href: "https://instagram.com/giuseppefalcone", icon: Instagram, label: "Instagram" },
  { href: "https://soundcloud.com/giuseppefalcone", icon: Music2, label: "SoundCloud" },
  { href: "https://youtube.com/@giuseppefalcone", icon: Youtube, label: "YouTube" },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? "glass py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative group">
            <span className="text-xl font-bold tracking-wider uppercase">
              Giuseppe
              <span className="text-[#ff0080]">.</span>
              Falcone
            </span>
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ff0080] transition-all duration-300 group-hover:w-full" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm font-medium tracking-wide uppercase transition-colors ${
                  item.label === "Book Now"
                    ? "px-4 py-2 bg-[#ff0080] text-white hover:bg-[#ff0080]/80"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {item.label}
                {item.label !== "Book Now" && (
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ff0080] transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Social Links - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-[#ff0080] transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-[#0a0a0a] border-l border-white/10 flex flex-col justify-center px-12"
            >
              <div className="space-y-6">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block text-2xl font-light tracking-wide ${
                        item.label === "Book Now"
                          ? "text-[#ff0080]"
                          : "text-white/80 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-12 pt-12 border-t border-white/10">
                <div className="flex items-center gap-6">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-[#ff0080] transition-colors"
                    >
                      <social.icon className="w-6 h-6" />
                    </a>
                  ))}
                </div>
                <a
                  href="mailto:booking@giuseppefalcone.com"
                  className="mt-6 flex items-center gap-2 text-white/60 hover:text-white text-sm"
                >
                  <Mail className="w-4 h-4" />
                  booking@giuseppefalcone.com
                </a>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
