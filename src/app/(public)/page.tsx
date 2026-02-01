import Hero from "@/components/public/Hero";
import DecadesMixer from "@/components/public/DecadesMixer";
import EventsSection from "@/components/public/EventsSection";
import MixesSection from "@/components/public/MixesSection";
import LiveProof from "@/components/public/LiveProof";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getHomePageData() {
  const [events, mixes, settings] = await Promise.all([
    prisma.event.findMany({
      where: {
        isPublished: true,
        startAt: { gte: new Date() },
      },
      orderBy: { startAt: "asc" },
      take: 4,
    }),
    prisma.mix.findMany({
      where: { isPublished: true },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      take: 7,
    }),
    prisma.siteSettings.findFirst({
      where: { slug: "main" },
    }),
  ]);

  return { events, mixes, settings };
}

export default async function HomePage() {
  const { events, mixes, settings } = await getHomePageData();

  return (
    <>
      <Hero
        videoUrl={settings?.heroVideoUrl || undefined}
        imageUrl={settings?.heroImageUrl || undefined}
      />
      <DecadesMixer />
      <LiveProof />
      <EventsSection events={events} />
      <MixesSection mixes={mixes} />
    </>
  );
}
