"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mixSchema, type MixInput } from "@/lib/validations";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NewMixPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MixInput>({
    resolver: zodResolver(mixSchema),
    defaultValues: {
      isFeatured: false,
      isPublished: true,
      sortOrder: 0,
    },
  });

  const onSubmit = async (data: MixInput) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/mixes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create mix");
      toast.success("Mix created successfully");
      router.push("/admin/mixes");
    } catch (error) {
      toast.error("Failed to create mix");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/mixes"
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">New Mix</h1>
          <p className="text-white/60 mt-1">Add a new mix to your collection</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
        <div className="glass rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Mix Title *
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="80s Classics Vol. 1"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-400">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Embed URL *
            </label>
            <input
              {...register("embedUrl")}
              type="url"
              placeholder="https://soundcloud.com/..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
            <p className="mt-1 text-xs text-white/40">
              Paste the URL from SoundCloud, Mixcloud, or YouTube
            </p>
            {errors.embedUrl && (
              <p className="mt-1 text-sm text-red-400">{errors.embedUrl.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Platform *
              </label>
              <select
                {...register("embedType")}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
              >
                <option value="soundcloud">SoundCloud</option>
                <option value="mixcloud">Mixcloud</option>
                <option value="youtube">YouTube</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Decade
              </label>
              <select
                {...register("decade")}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
              >
                <option value="">Select...</option>
                <option value="SEVENTIES">70s</option>
                <option value="EIGHTIES">80s</option>
                <option value="NINETIES">90s</option>
                <option value="MIXED">Mixed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Description
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe this mix..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Cover Image URL
            </label>
            <input
              {...register("coverUrl")}
              type="url"
              placeholder="https://..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Duration (seconds)
              </label>
              <input
                {...register("duration", { valueAsNumber: true })}
                type="number"
                placeholder="3600"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">
                Sort Order
              </label>
              <input
                {...register("sortOrder", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-[#ff0080] transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                {...register("isFeatured")}
                type="checkbox"
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#ff0080] focus:ring-[#ff0080]"
              />
              <span className="text-sm">Featured Mix</span>
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
              "Create Mix"
            )}
          </button>
          <Link
            href="/admin/mixes"
            className="px-6 py-3 border border-white/20 font-medium rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
