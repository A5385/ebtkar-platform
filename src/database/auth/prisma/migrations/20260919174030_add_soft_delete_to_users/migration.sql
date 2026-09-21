-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deleteAt" TIMESTAMP(3),
ADD COLUMN     "isDelete" BOOLEAN DEFAULT false;
