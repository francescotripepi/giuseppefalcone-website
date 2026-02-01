import { Metadata } from "next";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and videos from Giuseppe Falcone's performances.",
};

async function getGalleryMedia() {
  const media = await prisma.mediaAsset.findMany({
    where: {
      type: { in: ["PHOTO", "VIDEO"] },
    },
    orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return media;
}

export default async function GalleryPage() {
  const media = await getGalleryMedia();

  const photos = media.filter((m) => m.type === "PHOTO");
  const videos = media.filter((m) => m.type === "VIDEO");

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-white/60 mb-4">
            Visual Journey
          </p>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-gradient-neon">Gallery</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Moments captured from performances around the world.
          </p>
        </div>

        {/* Photos Section */}
        {photos.length > 0 && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <a
                  key={photo.id}
                  href={photo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative overflow-hidden rounded-lg bg-[#1f1f1f] ${
                    index === 0 ? "col-span-2 row-span-2" : ""
                  } aspect-square`}
                >
                  <img
                    src={photo.thumbnailUrl || photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="font-medium">{photo.title}</p>
                      {photo.decade && (
                        <span className="text-xs text-[#ff0080]">
                          {photo.decade === "SEVENTIES" ? "70s" :
                           photo.decade === "EIGHTIES" ? "80s" :
                           photo.decade === "NINETIES" ? "90s" : "Mixed"}
                        </span>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Videos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="glass rounded-lg overflow-hidden"
                >
                  <div className="aspect-video bg-[#1f1f1f] relative">
                    {video.thumbnailUrl ? (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-white/20">Video</span>
                      </div>
                    )}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full bg-[#ff0080] flex items-center justify-center">
                        <svg
                          className="w-6 h-6 ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </a>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-white/60 mt-1 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {photos.length === 0 && videos.length === 0 && (
          <div className="text-center py-16 glass rounded-lg">
            <p className="text-white/60">Gallery coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
