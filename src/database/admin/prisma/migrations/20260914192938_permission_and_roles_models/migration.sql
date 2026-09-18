/*
  Warnings:

  - You are about to drop the column `name` on the `permissions` table. All the data in the column will be lost.
  - You are about to drop the `ColorSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `GlobalSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NetworkSettings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TokensConfig` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[moduleId,resource,actionId]` on the table `permissions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `actionId` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `moduleId` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resource` to the `permissions` table without a default value. This is not possible if the table is not empty.
  - Made the column `isSuperAdmin` on table `roles` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "permissions_name_key";

-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "name",
ADD COLUMN     "actionId" TEXT NOT NULL,
ADD COLUMN     "moduleId" TEXT NOT NULL,
ADD COLUMN     "resource" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "isSuperAdmin" SET NOT NULL;

-- DropTable
DROP TABLE "ColorSettings";

-- DropTable
DROP TABLE "GlobalSettings";

-- DropTable
DROP TABLE "NetworkSettings";

-- DropTable
DROP TABLE "TokensConfig";

-- CreateTable
CREATE TABLE "global_settings" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "platformName" TEXT NOT NULL DEFAULT 'Ebtkar',
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_settings" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "httpClientRetries" INTEGER NOT NULL DEFAULT 3,
    "requestTimeoutMs" INTEGER NOT NULL DEFAULT 30000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "network_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_config" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "accessTokenExp" INTEGER NOT NULL DEFAULT 900,
    "refreshTokenExp" INTEGER NOT NULL DEFAULT 2592000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apps" (
    "appId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "apps_pkey" PRIMARY KEY ("appId")
);

-- CreateTable
CREATE TABLE "modules" (
    "moduleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "appId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("moduleId")
);

-- CreateTable
CREATE TABLE "actions" (
    "actionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("actionId")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "auditId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("auditId")
);

-- CreateIndex
CREATE UNIQUE INDEX "apps_name_key" ON "apps"("name");

-- CreateIndex
CREATE UNIQUE INDEX "apps_code_key" ON "apps"("code");

-- CreateIndex
CREATE UNIQUE INDEX "modules_appId_code_key" ON "modules"("appId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "actions_name_key" ON "actions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_moduleId_resource_actionId_key" ON "permissions"("moduleId", "resource", "actionId");

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_appId_fkey" FOREIGN KEY ("appId") REFERENCES "apps"("appId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "modules"("moduleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES "actions"("actionId") ON DELETE CASCADE ON UPDATE CASCADE;
