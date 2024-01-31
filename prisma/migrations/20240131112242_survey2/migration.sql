-- AlterTable
ALTER TABLE "Survey" ALTER COLUMN "votoPartido" DROP NOT NULL,
ALTER COLUMN "preferenciaPartido" DROP NOT NULL,
ALTER COLUMN "candidatoPreferencia" DROP NOT NULL,
ALTER COLUMN "candidatoInternoPreferencia" DROP NOT NULL,
ALTER COLUMN "mediosInformacion" DROP NOT NULL,
ALTER COLUMN "edad" DROP NOT NULL,
ALTER COLUMN "departamentoResidencia" DROP NOT NULL;
