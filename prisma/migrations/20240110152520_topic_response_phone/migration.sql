/*
  Warnings:

  - Added the required column `phone` to the `TopicResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TopicResponse" ADD COLUMN     "phone" TEXT NOT NULL;
