import { prisma } from "./db";

export interface AuditLogParams {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  meta?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        meta: params.meta,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to log audit:", error);
  }
}

export const AuditActions = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  UPLOAD: "UPLOAD",
  VIEW: "VIEW",
} as const;

export const EntityTypes = {
  ADMIN_USER: "AdminUser",
  BOOKING: "BookingRequest",
  EVENT: "Event",
  MEDIA: "MediaAsset",
  MIX: "Mix",
  PRESS_KIT: "PressKit",
  SETTINGS: "SiteSettings",
} as const;
