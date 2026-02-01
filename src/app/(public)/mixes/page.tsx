import { Metadata } from "next";
import MixesSection from "@/components/public/MixesSection";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mixes",
  description: "Listen to Giuseppe Falcone's mix collection spanning 70s, 80s, and 90s classics.",
};

async function getMixes() {
  const mixes = await prisma.mix.findMany({
    where: { isPublished: true },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return mixes;
}

export default async function MixesPage() {
  const mixes = await getMixes();

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            The Vault
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Mix <span className="text-gradient-neon">Collection</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Dive into the complete collection of mixes. From funky 70s disco to
            energetic 90s dance anthems, every set tells a story.
          </p>
        </div>

        <MixesSection mixes={mixes} showAll />
      </div>
    </div>
  );
}
