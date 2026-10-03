/*
  Warnings:

  - You are about to drop the column `allowCredentials` on the `origins` table. All the data in the column will be lost.
  - You are about to drop the column `allowedMethods` on the `origins` table. All the data in the column will be lost.
  - You are about to drop the column `enabled` on the `origins` table. All the data in the column will be lost.
  - You are about to drop the column `maxAgeSeconds` on the `origins` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[origin]` on the table `origins` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "origins" DROP COLUMN "allowCredentials",
DROP COLUMN "allowedMethods",
DROP COLUMN "enabled",
DROP COLUMN "maxAgeSeconds",
ADD COLUMN     "credentials" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "methods" "HttpMethod"[];

-- CreateIndex
CREATE UNIQUE INDEX "origins_origin_key" ON "origins"("origin");
