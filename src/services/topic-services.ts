import * as z from "zod"
import { prisma } from "@/lib/db"

export type TopicDAO = {
	id: string
	createdAt: Date
	updatedAt: Date
	name: string
	prompt: string
	enabled: boolean
  enabledStr: string
	clientId: string
}

export const topicSchema = z.object({
	name: z.string({required_error: "name is required."}),
	prompt: z.string({required_error: "prompt is required."}),
	clientId: z.string({required_error: "clientId is required."}),
})

export type TopicFormValues = z.infer<typeof topicSchema>


export async function getTopicsDAO() {
  const found = await prisma.topic.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  // add enabledStr
  const res: TopicDAO[] = found.map((topic) => {
    return {
      ...topic,
      enabledStr: topic.enabled ? "si" : "no"
    }
  })

  return res as TopicDAO[]
}

export async function getTopicByName(name: string) {
  const found = await prisma.topic.findFirst({
    where: {
      name
    }
  })
  return found
}

export async function getEnabledTopicsDAOByClient(clientId: string) {
  const found = await prisma.topic.findMany({
    where: {
      enabled: true,
      clientId
    },
    orderBy: {
      id: 'asc'
    },
  })
  // add enabledStr
  const res: TopicDAO[] = found.map((topic) => {
    return {
      ...topic,
      enabledStr: topic.enabled ? "si" : "no"
    }
  })

  return res as TopicDAO[]
}

export async function getEnabledTopicsDAOBySlug(clientSlug: string) {
  const found = await prisma.topic.findMany({
    where: {
      enabled: true,
      client: {
        slug: clientSlug
      }
    },
    orderBy: {
      createdAt: 'asc'
    },
  })
  const res: TopicDAO[] = found.map((topic) => {
    return {
      ...topic,
      enabledStr: topic.enabled ? "si" : "no"
    }
  })

  return res as TopicDAO[]
}

export async function getEnabledTopicDAOByClientAndName(clientId: string, name: string) {
  const found = await prisma.topic.findFirst({
    where: {
      enabled: true,
      clientId,
      name
    },
  })
  return found as TopicDAO
}

export async function getTopicDAO(id: string) {
  const found = await prisma.topic.findUnique({
    where: {
      id
    },
  })
  return found as TopicDAO
}
    
export async function createTopic(data: TopicFormValues) {
  const created = await prisma.topic.create({
    data
  })
  return created
}

export async function updateTopic(id: string, data: TopicFormValues) {
  const updated = await prisma.topic.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function toggleTopicEnabled(id: string) {
  const topic = await getTopicDAO(id)

  const updated = await prisma.topic.update({
    where: {
      id
    },
    data: {
      enabled: !topic.enabled
    }
  })

  return updated
}

export async function deleteTopic(id: string) {
  const deleted = await prisma.topic.delete({
    where: {
      id
    },
  })
  return deleted
}


    