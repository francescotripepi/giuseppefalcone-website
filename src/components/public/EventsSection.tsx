"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, ArrowRight, Ticket } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  startAt: Date | string;
  city: string;
  country: string;
  venue: string;
  ticketUrl?: string | null;
  imageUrl?: string | null;
  isFeatured: boolean;
}

interface EventsSectionProps {
  events: Event[];
  showAll?: boolean;
}

export default function EventsSection({ events, showAll = false }: EventsSectionProps) {
  const displayEvents = showAll ? events : events.slice(0, 4);

  return (
    <section className="py-24 md:py-32">
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
              Live Performances
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Upcoming <span className="text-[#ff0080]">Events</span>
            </h2>
          </div>
          {!showAll && events.length > 4 && (
            <Link
              href="/events"
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              View All Events
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </motion.div>

        {/* Events Grid */}
        {displayEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {displayEvents.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`group relative overflow-hidden rounded-lg ${
                  event.isFeatured ? "md:col-span-2" : ""
                }`}
              >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1f1f1f] to-[#141414]" />
                {event.imageUrl && (
                  <div
                    className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.imageUrl})` }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

                {/* Content */}
                <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-6 md:items-center">
                  {/* Date */}
                  <div className="flex-shrink-0 text-center md:text-left">
                    <div className="inline-flex flex-col items-center glass p-4 rounded-lg">
                      <span className="text-3xl md:text-4xl font-bold text-[#ff0080]">
                        {format(new Date(event.startAt), "dd")}
                      </span>
                      <span className="text-sm uppercase tracking-wider text-white/60">
                        {format(new Date(event.startAt), "MMM")}
                      </span>
                      <span className="text-xs text-white/40">
                        {format(new Date(event.startAt), "yyyy")}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-grow">
                    <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-[#ff0080] transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {event.city}, {event.country}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {event.venue}
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  {event.ticketUrl && (
                    <a
                      href={event.ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-[#ff0080] text-white font-medium text-sm uppercase tracking-wide hover:bg-[#ff0080]/80 transition-colors"
                    >
                      <Ticket className="w-4 h-4" />
                      Get Tickets
                    </a>
                  )}
                </div>

                {/* Featured Badge */}
                {event.isFeatured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#ff0080] text-xs font-bold uppercase tracking-wider">
                    Featured
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass rounded-lg">
            <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">No upcoming events scheduled.</p>
            <Link
              href="/booking"
              className="inline-block mt-4 text-[#ff0080] hover:underline"
            >
              Book Giuseppe for your event
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
