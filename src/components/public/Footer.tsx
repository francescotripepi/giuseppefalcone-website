"use client";

import Link from "next/link";
import { Instagram, Music2, Youtube, Mail } from "lucide-react";

const navigation = {
  main: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Mixes", href: "/mixes" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "EPK", href: "/epk" },
    { name: "Booking", href: "/booking" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  social: [
    { name: "Instagram", href: "https://instagram.com/giuseppefalcone", icon: Instagram },
    { name: "SoundCloud", href: "https://soundcloud.com/giuseppefalcone", icon: Music2 },
    { name: "YouTube", href: "https://youtube.com/@giuseppefalcone", icon: Youtube },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold tracking-wider uppercase">
                Giuseppe
                <span className="text-[#ff0080]">.</span>
                Falcone
              </span>
            </Link>
            <p className="mt-4 text-white/60 max-w-md">
              Master of 70s/80s/90s classics. Bringing the golden era of dance music
              to venues worldwide.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {navigation.social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 glass rounded-full text-white/60 hover:text-[#ff0080] transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-4">
              Bookings
            </h3>
            <a
              href="mailto:booking@giuseppefalcone.com"
              className="flex items-center gap-2 text-white/60 hover:text-[#ff0080] transition-colors"
            >
              <Mail className="w-4 h-4" />
              booking@giuseppefalcone.com
            </a>
            <div className="mt-6">
              <Link
                href="/booking"
                className="inline-block px-6 py-3 bg-[#ff0080] text-white font-medium text-sm uppercase tracking-wide hover:bg-[#ff0080]/80 transition-colors"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            {new Date().getFullYear()} Giuseppe Falcone. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {navigation.legal.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
