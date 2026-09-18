/*
  Warnings:

  - You are about to drop the `color_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `global_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `network_settings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tokens_config` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "color_settings";

-- DropTable
DROP TABLE "global_settings";

-- DropTable
DROP TABLE "network_settings";

-- DropTable
DROP TABLE "tokens_config";

-- CreateTable
CREATE TABLE "GlobalSettings" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NetworkSettings" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "httpClientReties" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NetworkSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColorSettings" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "mainColor" TEXT,
    "secColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColorSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokensConfig" (
    "tokenConfigId" BOOLEAN NOT NULL DEFAULT true,
    "accessTokenExp" INTEGER,
    "refreshTokenExp" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TokensConfig_pkey" PRIMARY KEY ("tokenConfigId")
);

-- CreateTable
CREATE TABLE "roles" (
    "roleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("roleId")
);

-- CreateTable
CREATE TABLE "permissions" (
    "permissionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("permissionId")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "rolePermissionId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("rolePermissionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("roleId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("permissionId") ON DELETE CASCADE ON UPDATE CASCADE;
