-- CreateTable
CREATE TABLE "LoginInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastLogin" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "at" TEXT NOT NULL,
    "rt" TEXT NOT NULL,

    CONSTRAINT "LoginInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoginInfo_userId_key" ON "LoginInfo"("userId");

-- AddForeignKey
ALTER TABLE "LoginInfo" ADD CONSTRAINT "LoginInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
