-- CreateTable
CREATE TABLE "TopicResponse" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "respuestaPlanteo" TEXT NOT NULL,
    "respuestaSolucion" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "TopicResponse_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TopicResponse" ADD CONSTRAINT "TopicResponse_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;
