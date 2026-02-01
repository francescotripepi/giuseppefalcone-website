import { Metadata } from "next";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Download, Instagram, Music2, Youtube, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Electronic Press Kit",
  description: "Giuseppe Falcone's official electronic press kit for promoters and media.",
};

async function getPressKit() {
  const pressKit = await prisma.pressKit.findFirst({
    where: { slug: "main" },
  });
  return pressKit;
}

async function getMedia() {
  const photos = await prisma.mediaAsset.findMany({
    where: {
      type: "PHOTO",
      category: "press",
    },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
  return photos;
}

const socialIcons: Record<string, any> = {
  instagram: Instagram,
  soundcloud: Music2,
  youtube: Youtube,
};

export default async function EPKPage() {
  const [pressKit, photos] = await Promise.all([getPressKit(), getMedia()]);

  const socialLinks = pressKit?.socialLinks as Record<string, string> | null;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            For Promoters & Media
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Electronic <span className="text-[#ff0080]">Press Kit</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Everything you need to promote Giuseppe Falcone at your event.
          </p>
        </div>

        {/* Bio Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#ff0080]" />
            Biography
          </h2>
          <div className="glass p-8 rounded-xl">
            {pressKit?.bioShort ? (
              <p className="text-lg text-white/80 leading-relaxed">
                {pressKit.bioShort}
              </p>
            ) : (
              <p className="text-lg text-white/80 leading-relaxed">
                Giuseppe Falcone is a legendary DJ specializing in 70s disco, 80s synth-pop,
                and 90s dance classics. With over three decades of experience, he has performed
                at some of the world's most prestigious venues, bringing the golden era of dance
                music to life for audiences across the globe.
              </p>
            )}
          </div>
        </section>

        {/* Social Links */}
        {socialLinks && Object.keys(socialLinks).length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#ff0080]" />
              Social Media
            </h2>
            <div className="flex flex-wrap gap-4">
              {Object.entries(socialLinks).map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIcons[platform] || ExternalLink;
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-3 glass rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <Icon className="w-5 h-5 text-[#ff0080]" />
                    <span className="capitalize">{platform}</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Press Photos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#ff0080]" />
            Press Photos
          </h2>
          {photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <a
                  key={photo.id}
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square rounded-lg overflow-hidden bg-[#1f1f1f]"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Download className="w-8 h-8" />
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="glass p-8 rounded-xl text-center text-white/60">
              Press photos coming soon.
            </div>
          )}
          {pressKit?.pressPhotosUrls && pressKit.pressPhotosUrls.length > 0 && (
            <div className="mt-6">
              <a
                href={pressKit.pressPhotosUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff0080] text-white font-medium uppercase tracking-wide hover:bg-[#ff0080]/80 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download All Photos
              </a>
            </div>
          )}
        </section>

        {/* Tech Rider */}
        {pressKit?.techRiderUrl && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#ff0080]" />
              Technical Rider
            </h2>
            <div className="glass p-8 rounded-xl">
              <p className="text-white/60 mb-6">
                Download the full technical rider with equipment requirements and stage setup.
              </p>
              <a
                href={pressKit.techRiderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 font-medium uppercase tracking-wide hover:bg-white/10 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Tech Rider (PDF)
              </a>
            </div>
          </section>
        )}

        {/* Contact */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="w-8 h-[2px] bg-[#ff0080]" />
            Booking Contact
          </h2>
          <div className="glass p-8 rounded-xl">
            <p className="text-white/60 mb-4">
              For booking inquiries and press requests:
            </p>
            <a
              href="mailto:booking@giuseppefalcone.com"
              className="text-xl text-[#ff0080] hover:underline"
            >
              booking@giuseppefalcone.com
            </a>
            <div className="mt-8">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff0080] text-white font-medium uppercase tracking-wide hover:bg-[#ff0080]/80 transition-colors"
              >
                Submit Booking Request
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
