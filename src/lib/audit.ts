import { db as prisma } from "./db";

type ActorType = "ADMIN" | "CLIENT" | "SYSTEM" | "PROVIDER";

export async function logAudit(params: {
  actorType: ActorType;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  previousState?: any;
  newState?: any;
  reason?: string;
}) {
  return prisma.auditLog.create({
    data: {
      actorType: params.actorType,
      actorId: params.actorId || null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      previousState: params.previousState ? JSON.stringify(params.previousState) : null,
      newState: params.newState ? JSON.stringify(params.newState) : null,
      reason: params.reason || null,
    },
  });
}
