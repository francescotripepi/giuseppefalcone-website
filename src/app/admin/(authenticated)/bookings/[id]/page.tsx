"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft, Mail, Phone, Calendar, MapPin, DollarSign, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  eventDate: string;
  location: string;
  venue: string | null;
  budgetRange: string | null;
  eventType: string | null;
  message: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

const statuses = [
  { value: "NEW", label: "New", color: "bg-blue-500" },
  { value: "CONTACTED", label: "Contacted", color: "bg-yellow-500" },
  { value: "NEGOTIATING", label: "Negotiating", color: "bg-purple-500" },
  { value: "CONFIRMED", label: "Confirmed", color: "bg-green-500" },
  { value: "DECLINED", label: "Declined", color: "bg-red-500" },
  { value: "COMPLETED", label: "Completed", color: "bg-gray-500" },
];

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch booking");
        const data = await res.json();
        setBooking(data);
        setNotes(data.notes || "");
        setStatus(data.status);
      } catch (error) {
        toast.error("Failed to load booking");
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooking();
  }, [params.id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/bookings/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (!res.ok) throw new Error("Failed to update booking");
      toast.success("Booking updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update booking");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff0080]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-16">
        <p className="text-white/60">Booking not found</p>
        <Link href="/admin/bookings" className="text-[#ff0080] hover:underline mt-4 inline-block">
          Back to bookings
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/bookings"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{booking.name}</h1>
          <p className="text-white/60 mt-1">
            Submitted {format(new Date(booking.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-sm text-white/40">Email</p>
                  <a
                    href={`mailto:${booking.email}`}
                    className="text-[#ff0080] hover:underline"
                  >
                    {booking.email}
                  </a>
                </div>
              </div>
              {booking.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-sm text-white/40">Phone</p>
                    <a
                      href={`tel:${booking.phone}`}
                      className="hover:text-[#ff0080] transition-colors"
                    >
                      {booking.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Event Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-sm text-white/40">Event Date</p>
                  <p>{format(new Date(booking.eventDate), "MMMM d, yyyy")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-sm text-white/40">Location</p>
                  <p>{booking.location}</p>
                  {booking.venue && (
                    <p className="text-sm text-white/60">{booking.venue}</p>
                  )}
                </div>
              </div>
              {booking.eventType && (
                <div>
                  <p className="text-sm text-white/40">Event Type</p>
                  <p className="capitalize">{booking.eventType}</p>
                </div>
              )}
              {booking.budgetRange && (
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-white/40" />
                  <div>
                    <p className="text-sm text-white/40">Budget Range</p>
                    <p>{booking.budgetRange}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Message</h2>
            <p className="text-white/80 whitespace-pre-wrap">{booking.message}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Status</h2>
            <div className="space-y-2">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    status === s.value
                      ? "bg-white/10 border border-white/20"
                      : "hover:bg-white/5"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${s.color}`} />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="glass rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Internal Notes</h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              placeholder="Add private notes about this booking..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-[#ff0080] text-white font-medium rounded-lg hover:bg-[#ff0080]/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
