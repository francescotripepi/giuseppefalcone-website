import { z } from "zod";

export const bookingRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  eventDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  location: z.string().min(2, "Location is required"),
  venue: z.string().optional(),
  budgetRange: z.string().optional(),
  eventType: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const eventSchema = z.object({
  title: z.string().min(2, "Title is required"),
  startAt: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid start date"),
  endAt: z.string().optional().nullable(),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  venue: z.string().min(2, "Venue is required"),
  description: z.string().optional(),
  ticketUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
});

export const mediaAssetSchema = z.object({
  type: z.enum(["PHOTO", "VIDEO", "DOCUMENT", "AUDIO"]),
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  url: z.string().url("Invalid URL"),
  thumbnailUrl: z.string().optional(),
  s3Key: z.string().optional(),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
  tags: z.array(z.string()).default([]),
  decade: z.enum(["SEVENTIES", "EIGHTIES", "NINETIES", "MIXED"]).optional().nullable(),
  category: z.string().optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
});

export const mixSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
  embedUrl: z.string().url("Invalid embed URL"),
  embedType: z.enum(["soundcloud", "mixcloud", "youtube"]),
  coverUrl: z.string().optional(),
  decade: z.enum(["SEVENTIES", "EIGHTIES", "NINETIES", "MIXED"]).optional().nullable(),
  duration: z.number().optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  isPublished: z.boolean().default(true),
});

export const pressKitSchema = z.object({
  bioShort: z.string().min(50, "Short bio must be at least 50 characters"),
  bioLong: z.string().optional(),
  techRiderUrl: z.string().url().optional().or(z.literal("")),
  pressPhotosUrls: z.array(z.string()).default([]),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    soundcloud: z.string().optional(),
    mixcloud: z.string().optional(),
    youtube: z.string().optional(),
    spotify: z.string().optional(),
  }).optional(),
  achievements: z.array(z.string()).default([]),
});

export const contactMessageSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type MediaAssetInput = z.infer<typeof mediaAssetSchema>;
export type MixInput = z.infer<typeof mixSchema>;
export type PressKitInput = z.infer<typeof pressKitSchema>;
export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
