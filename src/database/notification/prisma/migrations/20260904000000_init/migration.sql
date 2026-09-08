CREATE TYPE "NotificationAudience" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "NotificationType" AS ENUM ('USER_CREATED', 'SYSTEM');

CREATE TABLE "Notification" (
    "notificationId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "audience" "NotificationAudience" NOT NULL,
    "recipientId" TEXT,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationId")
);

CREATE UNIQUE INDEX "Notification_eventId_key" ON "Notification"("eventId");
CREATE INDEX "Notification_audience_readAt_createdAt_idx" ON "Notification"("audience", "readAt", "createdAt");
CREATE INDEX "Notification_recipientId_readAt_createdAt_idx" ON "Notification"("recipientId", "readAt", "createdAt");
