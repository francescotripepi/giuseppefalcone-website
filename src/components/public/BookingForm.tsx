"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingRequestSchema, type BookingRequestInput } from "@/lib/validations";
import { Calendar, MapPin, Mail, Phone, User, MessageSquare, Loader2, Check } from "lucide-react";

export default function BookingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookingRequestInput>({
    resolver: zodResolver(bookingRequestSchema),
  });

  const onSubmit = async (data: BookingRequestInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit booking request");
      }

      setIsSuccess(true);
      reset();
    } catch (err) {
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-xl p-8 md:p-12 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center">
          <Check className="w-8 h-8 text-[#00ff88]" />
        </div>
        <h3 className="text-2xl font-bold mb-4">Request Received</h3>
        <p className="text-white/60 mb-6">
          Thank you for your interest in booking Giuseppe Falcone.
          We'll review your request and get back to you within 24-48 hours.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 border border-white/20 font-medium uppercase tracking-wide hover:bg-white/10 transition-colors"
        >
          Submit Another Request
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-xl p-6 md:p-8"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Your Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              {...register("name")}
              type="text"
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              {...register("phone")}
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
          </div>
        </div>

        {/* Event Date */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Event Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              {...register("eventDate")}
              type="date"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
          </div>
          {errors.eventDate && (
            <p className="mt-1 text-sm text-red-400">{errors.eventDate.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Location (City, Country) *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              {...register("location")}
              type="text"
              placeholder="Milan, Italy"
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
          </div>
          {errors.location && (
            <p className="mt-1 text-sm text-red-400">{errors.location.message}</p>
          )}
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Venue Name
          </label>
          <input
            {...register("venue")}
            type="text"
            placeholder="Club Paradise"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Event Type
          </label>
          <select
            {...register("eventType")}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors appearance-none"
          >
            <option value="">Select type...</option>
            <option value="club">Club Night</option>
            <option value="festival">Festival</option>
            <option value="private">Private Event</option>
            <option value="corporate">Corporate Event</option>
            <option value="wedding">Wedding</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Budget Range */}
        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">
            Budget Range
          </label>
          <select
            {...register("budgetRange")}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors appearance-none"
          >
            <option value="">Select range...</option>
            <option value="under-5k">Under 5,000</option>
            <option value="5k-10k">5,000 - 10,000</option>
            <option value="10k-25k">10,000 - 25,000</option>
            <option value="25k-50k">25,000 - 50,000</option>
            <option value="over-50k">Over 50,000</option>
          </select>
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-white/60 mb-2">
            Tell us about your event *
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-white/40" />
            <textarea
              {...register("message")}
              rows={5}
              placeholder="Describe your event, expected attendance, any special requirements..."
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors resize-none"
            />
          </div>
          {errors.message && (
            <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-4 bg-[#ff0080] text-white font-medium uppercase tracking-wide hover:bg-[#ff0080]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Booking Request"
          )}
        </button>
        <p className="mt-4 text-sm text-white/40">
          We typically respond within 24-48 hours. For urgent inquiries,
          please email us directly at{" "}
          <a href="mailto:booking@giuseppefalcone.com" className="text-[#ff0080] hover:underline">
            booking@giuseppefalcone.com
          </a>
        </p>
      </div>
    </motion.form>
  );
}
