-- CreateTable
CREATE TABLE "rate_limit" (
    "rateLimitId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "ttl" INTEGER NOT NULL,
    "networkSettingId" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rate_limit_pkey" PRIMARY KEY ("rateLimitId")
);

-- CreateIndex
CREATE UNIQUE INDEX "rate_limit_name_key" ON "rate_limit"("name");

-- AddForeignKey
ALTER TABLE "rate_limit" ADD CONSTRAINT "rate_limit_networkSettingId_fkey" FOREIGN KEY ("networkSettingId") REFERENCES "network_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
