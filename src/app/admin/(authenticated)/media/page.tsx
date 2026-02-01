"use client";

import { useEffect, useState, useRef } from "react";
import { Plus, Image as ImageIcon, Video, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

interface MediaAsset {
  id: string;
  type: string;
  title: string;
  url: string;
  thumbnailUrl: string | null;
  decade: string | null;
  isFeatured: boolean;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  async function fetchMedia() {
    try {
      const res = await fetch("/api/media");
      if (!res.ok) throw new Error("Failed to fetch media");
      const data = await res.json();
      setMedia(data);
    } catch (error) {
      toast.error("Failed to load media");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        // Get presigned URL
        const presignRes = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            contentType: file.type,
            folder: file.type.startsWith("image/") ? "photos" : "videos",
          }),
        });

        if (!presignRes.ok) throw new Error("Failed to get upload URL");
        const { uploadUrl, publicUrl, s3Key } = await presignRes.json();

        // Upload to S3
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        // Create media asset record
        const mediaRes = await fetch("/api/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: file.type.startsWith("image/") ? "PHOTO" : "VIDEO",
            title: file.name.replace(/\.[^/.]+$/, ""),
            url: publicUrl,
            s3Key,
            mimeType: file.type,
            fileSize: file.size,
            tags: [],
          }),
        });

        if (!mediaRes.ok) throw new Error("Failed to create media record");
      }

      toast.success("Files uploaded successfully");
      fetchMedia();
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function deleteMedia(id: string) {
    if (!confirm("Are you sure you want to delete this media?")) return;

    try {
      const res = await fetch(`/api/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete media");
      setMedia(media.filter((m) => m.id !== id));
      toast.success("Media deleted");
    } catch (error) {
      toast.error("Failed to delete media");
    }
  }

  const filteredMedia = filter === "all" ? media : media.filter((m) => m.type === filter);

  const typeIcons: Record<string, any> = {
    PHOTO: ImageIcon,
    VIDEO: Video,
    DOCUMENT: FileText,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ff0080]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-white/60 mt-1">Manage your photos and videos</p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 px-4 py-2 bg-[#ff0080] text-white font-medium rounded-lg hover:bg-[#ff0080]/80 transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {["all", "PHOTO", "VIDEO"].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === type
                ? "bg-[#ff0080] text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10"
            }`}
          >
            {type === "all" ? "All" : type === "PHOTO" ? "Photos" : "Videos"}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((item) => {
          const Icon = typeIcons[item.type] || FileText;
          return (
            <div
              key={item.id}
              className="group relative aspect-square rounded-lg overflow-hidden bg-[#1f1f1f]"
            >
              {item.type === "PHOTO" ? (
                <img
                  src={item.thumbnailUrl || item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className="w-8 h-8 text-white/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                </a>
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/40 text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {item.isFeatured && (
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ff0080]" />
              )}
            </div>
          );
        })}
        {filteredMedia.length === 0 && (
          <div className="col-span-full glass rounded-xl p-8 text-center text-white/40">
            No media found. Upload some files to get started.
          </div>
        )}
      </div>
    </div>
  );
}
