/*
  Warnings:

  - Added the required column `conversationId` to the `TopicResponse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TopicResponse" ADD COLUMN     "conversationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TopicResponse" ADD CONSTRAINT "TopicResponse_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
