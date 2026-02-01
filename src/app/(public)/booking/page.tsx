import { Metadata } from "next";
import BookingForm from "@/components/public/BookingForm";
import { Calendar, Clock, DollarSign, Headphones } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Giuseppe Falcone",
  description:
    "Book Giuseppe Falcone for your event. Club nights, festivals, private parties, corporate events, and weddings.",
};

const features = [
  {
    icon: Headphones,
    title: "Three Decades of Classics",
    description: "Expertly curated sets spanning 70s disco, 80s synth-pop, and 90s dance anthems.",
  },
  {
    icon: Calendar,
    title: "Flexible Booking",
    description: "Available for club nights, festivals, corporate events, and private celebrations.",
  },
  {
    icon: Clock,
    title: "Custom Set Length",
    description: "From 2-hour sets to all-night performances tailored to your event needs.",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    description: "Clear quotes with no hidden fees. Budget discussions welcome.",
  },
];

export default function BookingPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            Bookings
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Book <span className="text-[#ff0080]">Giuseppe</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Ready to bring the sound of three legendary decades to your event?
            Fill out the form below and let's make it happen.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Features */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-xl font-bold mb-6">Why Book Giuseppe?</h2>
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#ff0080]/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[#ff0080]" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-white/10">
              <p className="text-sm text-white/40 mb-2">Direct Contact</p>
              <a
                href="mailto:booking@giuseppefalcone.com"
                className="text-[#ff0080] hover:underline"
              >
                booking@giuseppefalcone.com
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
