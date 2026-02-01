import { prisma } from "@/lib/db";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

async function getBookings() {
  return prisma.bookingRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
}

const statusColors: Record<string, string> = {
  NEW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  CONTACTED: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  NEGOTIATING: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  CONFIRMED: "bg-green-500/20 text-green-400 border-green-500/30",
  DECLINED: "bg-red-500/20 text-red-400 border-red-500/30",
  COMPLETED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Bookings</h1>
          <p className="text-white/60 mt-1">Manage booking requests</p>
        </div>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-sm font-medium text-white/60">Name</th>
              <th className="text-left p-4 text-sm font-medium text-white/60">Event Date</th>
              <th className="text-left p-4 text-sm font-medium text-white/60">Location</th>
              <th className="text-left p-4 text-sm font-medium text-white/60">Status</th>
              <th className="text-left p-4 text-sm font-medium text-white/60">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="font-medium hover:text-[#ff0080] transition-colors"
                  >
                    {booking.name}
                  </Link>
                  <div className="text-sm text-white/40">{booking.email}</div>
                </td>
                <td className="p-4 text-white/80">
                  {format(booking.eventDate, "MMM d, yyyy")}
                </td>
                <td className="p-4 text-white/80">
                  {booking.location}
                  {booking.venue && (
                    <div className="text-sm text-white/40">{booking.venue}</div>
                  )}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${
                      statusColors[booking.status]
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="p-4 text-white/60 text-sm">
                  {format(booking.createdAt, "MMM d, yyyy")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="p-8 text-center text-white/40">No booking requests yet.</div>
        )}
      </div>
    </div>
  );
}
