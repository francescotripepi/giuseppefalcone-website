"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventInput } from "@/lib/validations";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      isFeatured: false,
      isPublished: true,
    },
  });

  const onSubmit = async (data: EventInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create event");
      toast.success("Event created successfully");
      router.push("/admin/events");
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/events"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Event</h1>
          <p className="text-white/60 mt-1">Create a new performance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="glass rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Event Title *
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="New Year's Eve Party"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Start Date & Time *
              </label>
              <input
                {...register("startAt")}
                type="datetime-local"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
              />
              {errors.startAt && (
                <p className="mt-1 text-sm text-red-400">{errors.startAt.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                End Date & Time
              </label>
              <input
                {...register("endAt")}
                type="datetime-local"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                City *
              </label>
              <input
                {...register("city")}
                type="text"
                placeholder="Milan"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Country *
              </label>
              <input
                {...register("country")}
                type="text"
                placeholder="Italy"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
              />
              {errors.country && (
                <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Venue *
            </label>
            <input
              {...register("venue")}
              type="text"
              placeholder="Club Paradise"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
            {errors.venue && (
              <p className="mt-1 text-sm text-red-400">{errors.venue.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Event description..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Ticket URL
            </label>
            <input
              {...register("ticketUrl")}
              type="url"
              placeholder="https://tickets.example.com/event"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register("isFeatured")}
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ff0080] focus:ring-[#ff0080]"
              />
              <span className="text-sm">Featured Event</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register("isPublished")}
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ff0080] focus:ring-[#ff0080]"
              />
              <span className="text-sm">Published</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-[#ff0080] text-white font-medium rounded-lg hover:bg-[#ff0080]/80 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Event"
            )}
          </button>
          <Link
            href="/admin/events"
            className="px-6 py-3 border border-white/20 font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
