import * as z from "zod"
import { prisma } from "@/lib/db"
import { TopicDAO, getTopicDAO } from "./topic-services"
import { revalidatePath } from "next/cache"
import { getActiveConversation } from "./conversationService"
//import { getActiveConversation } from "./conversationService"

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

export async function getActiveTopicResponsesDAOByPhone(phone: string) {
  const RAFFO_CLIENT_ID= process.env.RAFFO_CLIENT_ID
  if (!RAFFO_CLIENT_ID) throw new Error("RAFFO_CLIENT_ID not found")

  const activeConversation= await getActiveConversation(phone, RAFFO_CLIENT_ID)
  if (!activeConversation) return [] as TopicResponseDAO[]

  const found = await prisma.topicResponse.findMany({
    where: {
      phone,
      conversationId: activeConversation.id,
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

export async function getActiveTopicResponsesDAOByConversationId(conversationId: string) {
  const found = await prisma.topicResponse.findMany({
    where: {
      conversationId,
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

export async function getTopicResponseDAOByConversationAndTopicId(conversationId: string, topicId: string) {
  const found = await prisma.topicResponse.findFirst({
    where: {
      conversationId,
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
  const topic= await getTopicDAO(data.topicId)
  if (!topic) return null

  const activeConversation= await getActiveConversation(data.phone, topic.clientId)
  if (activeConversation) {
    const created = await prisma.topicResponse.create({
      data: {
        ...data,
        conversationId: activeConversation.id,
      },
    })
    return created
  
  } else {
    console.log("createTopicResponse: activeConversation not found")    
  }

  return null
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


    