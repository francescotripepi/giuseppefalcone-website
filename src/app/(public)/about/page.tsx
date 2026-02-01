import { Metadata } from "next";
import { motion } from "framer-motion";
import { prisma } from "@/lib/db";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Giuseppe Falcone, the master of 70s, 80s, and 90s classics.",
};

async function getPressKit() {
  const pressKit = await prisma.pressKit.findFirst({
    where: { slug: "main" },
  });
  return pressKit;
}

export default async function AboutPage() {
  const pressKit = await getPressKit();

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            The Story
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-[#ff0080]">Giuseppe</span>
          </h1>
        </div>

        {/* Bio Section */}
        <div className="prose prose-invert prose-lg max-w-none">
          {pressKit?.bioLong ? (
            <div dangerouslySetInnerHTML={{ __html: pressKit.bioLong.replace(/\n/g, "<br/>") }} />
          ) : (
            <>
              <p className="text-xl text-white/80 leading-relaxed mb-8">
                Giuseppe Falcone stands as one of the most passionate curators of dance music's
                golden era. With over three decades of experience behind the decks, he has
                mastered the art of weaving together the greatest hits from the 70s, 80s,
                and 90s into unforgettable musical journeys.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-6">The Journey</h2>
              <p className="text-white/70">
                Born and raised in Italy, Giuseppe discovered his love for music in the vibrant
                disco era of the late 1970s. What started as a passion for collecting vinyl
                records soon evolved into a career that would span continents and generations.
              </p>
              <p className="text-white/70">
                Through the synth-driven revolution of the 80s and the explosive dance scene
                of the 90s, Giuseppe was there - not just as a witness, but as an active
                participant shaping the soundscape of countless dancefloors.
              </p>

              <h2 className="text-2xl font-bold mt-12 mb-6">The Philosophy</h2>
              <p className="text-white/70">
                Every set is a carefully crafted journey through time. Giuseppe believes in
                the power of music to transport people, to trigger memories, and to create
                new ones. His approach combines deep knowledge of music history with an
                innate understanding of what makes a crowd move.
              </p>

              <div className="mt-12 p-8 glass rounded-xl">
                <blockquote className="text-xl italic text-white/80 border-l-4 border-[#ff0080] pl-6">
                  "Music is the universal language that connects generations. When I play,
                  I'm not just spinning records - I'm sharing stories, emotions, and the
                  pure joy of three incredible decades."
                </blockquote>
                <p className="mt-4 text-[#ff0080]">- Giuseppe Falcone</p>
              </div>
            </>
          )}
        </div>

        {/* Achievements */}
        {pressKit?.achievements && pressKit.achievements.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Achievements</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {pressKit.achievements.map((achievement, index) => (
                <div key={index} className="glass p-4 rounded-lg flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#ff0080]" />
                  <span className="text-white/80">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-white/60 mb-6">
            Ready to experience the sound of three decades?
          </p>
          <Link
            href="/booking"
            className="inline-block px-8 py-4 bg-[#ff0080] text-white font-medium uppercase tracking-wide hover:bg-[#ff0080]/80 transition-colors"
          >
            Book Giuseppe
          </Link>
        </div>
      </div>
    </div>
  );
}
