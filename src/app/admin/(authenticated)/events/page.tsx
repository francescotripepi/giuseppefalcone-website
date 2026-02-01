"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Calendar, MapPin, Ticket, Loader2, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  startAt: string;
  city: string;
  country: string;
  venue: string;
  isFeatured: boolean;
  isPublished: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch("/api/events?all=true");
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data);
    } catch (error) {
      toast.error("Failed to load events");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((e) => e.id !== id));
      toast.success("Event deleted");
    } catch (error) {
      toast.error("Failed to delete event");
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
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-white/60 mt-1">Manage your performances</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#ff0080] text-white font-medium rounded-lg hover:bg-[#ff0080]/80 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Event
        </Link>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="glass rounded-xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#ff0080]">
                  {format(new Date(event.startAt), "dd")}
                </div>
                <div className="text-xs text-white/60 uppercase">
                  {format(new Date(event.startAt), "MMM yyyy")}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{event.title}</h3>
                  {event.isFeatured && (
                    <span className="px-2 py-0.5 bg-[#ff0080]/20 text-[#ff0080] text-xs rounded">
                      Featured
                    </span>
                  )}
                  {!event.isPublished && (
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                      Draft
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.city}, {event.country}
                  </span>
                  <span>{event.venue}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/events/${event.id}`}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </Link>
              <button
                onClick={() => deleteEvent(event.id)}
                className="p-2 hover:bg-red-500/20 text-white/60 hover:text-red-400 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="glass rounded-xl p-8 text-center text-white/40">
            No events yet. Create your first event.
          </div>
        )}
      </div>
    </div>
  );
}
