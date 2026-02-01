import { Metadata } from "next";
import EventsSection from "@/components/public/EventsSection";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events",
  description: "Upcoming events and performances by Giuseppe Falcone.",
};

async function getEvents() {
  const events = await prisma.event.findMany({
    where: {
      isPublished: true,
      startAt: { gte: new Date() },
    },
    orderBy: { startAt: "asc" },
  });

  return events;
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            Live Performances
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Upcoming <span className="text-[#ff0080]">Events</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Catch Giuseppe Falcone live at these upcoming events and experience
            the ultimate journey through three decades of dance music.
          </p>
        </div>

        <EventsSection events={events} showAll />
      </div>
    </div>
  );
}
