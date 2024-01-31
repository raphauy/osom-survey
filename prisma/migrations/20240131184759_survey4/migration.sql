-- DropForeignKey
ALTER TABLE "Conversation" DROP CONSTRAINT "Conversation_surveyId_fkey";

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "idcrm" TEXT;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
