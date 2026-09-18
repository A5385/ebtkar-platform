-- CreateTable
CREATE TABLE "global_settings" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "network_settings" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "httpClientReties" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "network_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "color_settings" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "mainColor" TEXT,
    "secColor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "color_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_config" (
    "id" BOOLEAN NOT NULL DEFAULT true,
    "accessTokenExp" INTEGER,
    "refreshTokenExp" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tokens_config_pkey" PRIMARY KEY ("id")
);
