/*
  Warnings:

  - You are about to drop the `actions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `apps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TENANT');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD');

-- CreateEnum
CREATE TYPE "WarehousePermissions" AS ENUM ('BRANCH_CREATE', 'BRANCH_UPDATE', 'BRANCH_DELETE', 'BRANCH_ARCHIVE', 'BRANCH_READ', 'STORE_CREATE', 'STORE_UPDATE', 'STORE_DELETE', 'STORE_ARCHIVE', 'STORE_READ');

-- CreateEnum
CREATE TYPE "InvoicePermissions" AS ENUM ('INVOICE_CREATE', 'INVOICE_UPDATE', 'INVOICE_DELETE', 'INVOICE_ARCHIVE', 'INVOICE_READ');

-- DropForeignKey
ALTER TABLE "modules" DROP CONSTRAINT "modules_appId_fkey";

-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_actionId_fkey";

-- DropForeignKey
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_roleId_fkey";

-- AlterTable
ALTER TABLE "global_settings" ADD COLUMN     "defaultLocale" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "defaultTimezone" TEXT NOT NULL DEFAULT 'UTC',
ADD COLUMN     "favicon" TEXT,
ADD COLUMN     "logo" TEXT,
ADD COLUMN     "registrationEnabled" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "actions";

-- DropTable
DROP TABLE "apps";

-- DropTable
DROP TABLE "modules";

-- DropTable
DROP TABLE "permissions";

-- DropTable
DROP TABLE "role_permissions";

-- DropTable
DROP TABLE "roles";

-- CreateTable
CREATE TABLE "access_settings" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "corsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "access_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "origins" (
    "originId" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "allowedMethods" "HttpMethod"[],
    "allowedHeaders" TEXT[],
    "exposedHeaders" TEXT[],
    "allowCredentials" BOOLEAN NOT NULL DEFAULT true,
    "maxAgeSeconds" INTEGER NOT NULL DEFAULT 86400,
    "accessSettingsId" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "origins_pkey" PRIMARY KEY ("originId")
);

-- CreateTable
CREATE TABLE "warehouse_settings" (
    "warehouseSettingsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_settings_pkey" PRIMARY KEY ("warehouseSettingsId")
);

-- CreateTable
CREATE TABLE "warehouse_roles" (
    "warehouseRoleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "warehouseSettingsId" TEXT NOT NULL,
    "permissions" "WarehousePermissions"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_roles_pkey" PRIMARY KEY ("warehouseRoleId")
);

-- CreateTable
CREATE TABLE "invoice_settings" (
    "invoiceSettingsId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_settings_pkey" PRIMARY KEY ("invoiceSettingsId")
);

-- CreateTable
CREATE TABLE "invoice_role" (
    "InvoiceRoleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "invoiceSettingsId" TEXT,
    "permissions" "InvoicePermissions"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoice_role_pkey" PRIMARY KEY ("InvoiceRoleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "origins_accessSettingsId_origin_key" ON "origins"("accessSettingsId", "origin");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_settings_code_key" ON "warehouse_settings"("code");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_roles_warehouseSettingsId_code_key" ON "warehouse_roles"("warehouseSettingsId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_settings_name_key" ON "invoice_settings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_settings_code_key" ON "invoice_settings"("code");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_role_name_key" ON "invoice_role"("name");

-- AddForeignKey
ALTER TABLE "origins" ADD CONSTRAINT "origins_accessSettingsId_fkey" FOREIGN KEY ("accessSettingsId") REFERENCES "access_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_roles" ADD CONSTRAINT "warehouse_roles_warehouseSettingsId_fkey" FOREIGN KEY ("warehouseSettingsId") REFERENCES "warehouse_settings"("warehouseSettingsId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_role" ADD CONSTRAINT "invoice_role_invoiceSettingsId_fkey" FOREIGN KEY ("invoiceSettingsId") REFERENCES "invoice_settings"("invoiceSettingsId") ON DELETE CASCADE ON UPDATE CASCADE;
