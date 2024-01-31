-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "surveyId" TEXT;

-- CreateTable
CREATE TABLE "Survey" (
    "id" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "votoPartido" TEXT NOT NULL,
    "preferenciaPartido" TEXT NOT NULL,
    "candidatoPreferencia" TEXT NOT NULL,
    "candidatoInternoPreferencia" TEXT NOT NULL,
    "mediosInformacion" TEXT NOT NULL,
    "edad" INTEGER NOT NULL,
    "departamentoResidencia" TEXT NOT NULL,

    CONSTRAINT "Survey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Survey_phone_key" ON "Survey"("phone");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_surveyId_fkey" FOREIGN KEY ("surveyId") REFERENCES "Survey"("id") ON DELETE CASCADE ON UPDATE CASCADE;
