import { prisma } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import {
  CalendarCheck,
  Calendar,
  Music2,
  Image,
  Mail,
  ArrowRight,
  Clock,
  TrendingUp,
} from "lucide-react";

async function getDashboardStats() {
  const [
    newBookings,
    upcomingEvents,
    totalMixes,
    totalMedia,
    unreadMessages,
    recentBookings,
    nextEvents,
  ] = await Promise.all([
    prisma.bookingRequest.count({ where: { status: "NEW" } }),
    prisma.event.count({ where: { startAt: { gte: new Date() }, isPublished: true } }),
    prisma.mix.count({ where: { isPublished: true } }),
    prisma.mediaAsset.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.bookingRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.event.findMany({
      where: { startAt: { gte: new Date() } },
      orderBy: { startAt: "asc" },
      take: 3,
    }),
  ]);

  return {
    stats: {
      newBookings,
      upcomingEvents,
      totalMixes,
      totalMedia,
      unreadMessages,
    },
    recentBookings,
    nextEvents,
  };
}

const statCards = [
  {
    label: "New Bookings",
    key: "newBookings" as const,
    icon: CalendarCheck,
    href: "/admin/bookings",
    color: "#ff0080",
  },
  {
    label: "Upcoming Events",
    key: "upcomingEvents" as const,
    icon: Calendar,
    href: "/admin/events",
    color: "#00d4ff",
  },
  {
    label: "Published Mixes",
    key: "totalMixes" as const,
    icon: Music2,
    href: "/admin/mixes",
    color: "#ffd000",
  },
  {
    label: "Media Assets",
    key: "totalMedia" as const,
    icon: Image,
    href: "/admin/media",
    color: "#00ff88",
  },
  {
    label: "Unread Messages",
    key: "unreadMessages" as const,
    icon: Mail,
    href: "/admin/messages",
    color: "#ff6600",
  },
];

const statusColors: Record<string, string> = {
  NEW: "bg-blue-500/20 text-blue-400",
  CONTACTED: "bg-yellow-500/20 text-yellow-400",
  NEGOTIATING: "bg-purple-500/20 text-purple-400",
  CONFIRMED: "bg-green-500/20 text-green-400",
  DECLINED: "bg-red-500/20 text-red-400",
  COMPLETED: "bg-gray-500/20 text-gray-400",
};

export default async function DashboardPage() {
  const { stats, recentBookings, nextEvents } = await getDashboardStats();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-white/60 mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.key}
            href={stat.href}
            className="glass rounded-xl p-6 hover:bg-white/5 transition-colors group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
              style={{ backgroundColor: `${stat.color}20` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: stat.color }}>
              {stats[stat.key]}
            </p>
            <p className="text-sm text-white/60 mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#ff0080]" />
              Recent Bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="text-sm text-white/60 hover:text-white flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {recentBookings.length > 0 ? (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <Link
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{booking.name}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        statusColors[booking.status]
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-sm text-white/60">
                    <span>{booking.location}</span>
                    <span className="mx-2">·</span>
                    <span>{format(booking.eventDate, "MMM d, yyyy")}</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-center py-8">No recent bookings</p>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="glass rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#00d4ff]" />
              Upcoming Events
            </h2>
            <Link
              href="/admin/events"
              className="text-sm text-white/60 hover:text-white flex items-center gap-1"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {nextEvents.length > 0 ? (
            <div className="space-y-4">
              {nextEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/admin/events/${event.id}`}
                  className="block p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 text-center">
                      <div className="text-2xl font-bold text-[#ff0080]">
                        {format(event.startAt, "dd")}
                      </div>
                      <div className="text-xs text-white/60 uppercase">
                        {format(event.startAt, "MMM")}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-white/60">
                        {event.venue} · {event.city}, {event.country}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-white/40 text-center py-8">No upcoming events</p>
          )}
        </div>
      </div>
    </div>
  );
}
