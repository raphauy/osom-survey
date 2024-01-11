import * as z from "zod"
import { prisma } from "@/lib/db"
import { TopicDAO } from "./topic-services"
import { revalidatePath } from "next/cache"

export type TopicResponseDAO = {
	id: string
  phone: string
	createdAt: Date
	updatedAt: Date
	respuestaPlanteo: string
	respuestaSolucion: string
  gravedad: number
	topic: TopicDAO
	topicId: string
  topicName: string | null
}

export const topicResponseSchema = z.object({
  phone: z.string({required_error: "phone is required."}),
	respuestaPlanteo: z.string({required_error: "respuestaPlanteo is required."}),
	respuestaSolucion: z.string({required_error: "respuestaSolucion is required."}),
  gravedad: z.number({required_error: "gravedad is required."}),
	topicId: z.string({required_error: "topicId is required."}),
})

export type TopicResponseFormValues = z.infer<typeof topicResponseSchema>


export async function getTopicResponsesDAO() {
  const found = await prisma.topicResponse.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      topic: true,
    },
  })
  const res= found.map((topicResponse) => {
    return {
      ...topicResponse,
      topic: {
        ...topicResponse.topic,
        enabledStr: topicResponse.topic.enabled ? "si" : "no"
      },
      topicName: topicResponse.topic.name
    }
  })

  return res
}

export async function getTopicResponsesDAOByPhone(phone: string) {
  const found = await prisma.topicResponse.findMany({
    where: {
      phone
    },
    include: {
      topic: true,
    },
    orderBy: {
      createdAt: 'asc'
    },
  })
  const res= found.map((topicResponse) => {
    return {
      ...topicResponse,
      topic: {
        ...topicResponse.topic,
        enabledStr: topicResponse.topic.enabled ? "si" : "no"
      },
      topicName: topicResponse.topic.name
    }
  })

  return res
}

export async function getTopicResponseDAOByPhoneAndTopicId(phone: string, topicId: string) {
  const found = await prisma.topicResponse.findFirst({
    where: {
      phone,
      topicId
    },
    include: {
      topic: true,
    },
  })
  if (!found) return null

  const res= {
    ...found,
    topic: {
      ...found.topic,
      enabledStr: found.topic.enabled ? "si" : "no"
    },
    topicName: found.topic.name,
  }

  return res as TopicResponseDAO
}

export async function getTopicResponseDAO(id: string) {
  const found = await prisma.topicResponse.findUnique({
    where: {
      id
    },
    include: {
      topic: true,
    },
  })
  if (!found) return null

  const res= {
    ...found,
    topic: {
      ...found.topic,
      enabledStr: found.topic.enabled ? "si" : "no"
    },
    topicName: found.topic.name,
  }

  return res
}
    
export async function createTopicResponse(data: TopicResponseFormValues) {
  const created = await prisma.topicResponse.create({
    data
  })
  return created
}

export async function updateTopicResponse(id: string, data: TopicResponseFormValues) {
  const updated = await prisma.topicResponse.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteTopicResponse(id: string) {
  const deleted = await prisma.topicResponse.delete({
    where: {
      id
    },
  })
  return deleted
}


    