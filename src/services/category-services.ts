import * as z from "zod"
import { prisma } from "@/lib/db"
import { TopicDAO } from "./topic-services"
import { TopicResponseDAO } from "./topicresponse-services"
import { getTopicResponsesDAO } from "./topicresponse-services"
import OpenAI from "openai"
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs"
import { getValue } from "./config-services"

export type CategoryDAO = {
	id: string
	name: string
	description: string | undefined
	createdAt: Date
	updatedAt: Date
	topic: TopicDAO
	topicId: string
  topicName: string
}

export const categorySchema = z.object({
	name: z.string({required_error: "name is required."}),
	description: z.string().optional(),
	topicId: z.string({required_error: "topicId is required."}),
})

export type CategoryFormValues = z.infer<typeof categorySchema>


export async function getCategorysDAO() {
  const found = await prisma.category.findMany({
    orderBy: {
      id: 'asc'
    },
  })
  return found as CategoryDAO[]
}

export async function getCategoryDAO(id: string) {
  const found = await prisma.category.findUnique({
    where: {
      id
    },
  })
  return found as CategoryDAO
}
    
export async function createCategory(data: CategoryFormValues) {
  // TODO: implement createCategory
  const created = await prisma.category.create({
    data
  })
  return created
}

export async function updateCategory(id: string, data: CategoryFormValues) {
  const updated = await prisma.category.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteCategory(id: string) {
  const deleted = await prisma.category.delete({
    where: {
      id
    },
  })
  return deleted
}
    
export async function getComplentaryTopicResponses(id: string) {
  const found = await prisma.category.findUnique({
    where: {
      id
    },
    include: {
      topicResponses: true,
    }
  })
  const all= await getTopicResponsesDAO()
  const res= all.filter(aux => {
    return !found?.topicResponses.find(c => c.id === aux.id)
  })
  
  return res
}

export async function setTopicResponses(id: string, topicResponses: TopicResponseDAO[]) {
  const oldTopicResponses= await prisma.category.findUnique({
    where: {
      id
    },
    include: {
      topicResponses: true,
    }
  })
  .then(res => res?.topicResponses)

  await prisma.category.update({
    where: {
      id
    },
    data: {
      topicResponses: {
        disconnect: oldTopicResponses
      }
    }
  })

  const updated= await prisma.category.update({
    where: {
      id
    },
    data: {
      topicResponses: {
        connect: topicResponses.map(c => ({id: c.id}))
      }
    }
  })

  if (!updated) {
    return false
  }

  return true
}



export async function getFullCategorysDAO() {
  const found = await prisma.category.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
			topic: true,
		}
  })

  const res= found.map(c => {
    return {
      ...c,
      topicName: c.topic.name
    }
  })

  return res as CategoryDAO[]
}
  
export async function getFullCategoryDAO(id: string) {
  const found = await prisma.category.findUnique({
    where: {
      id
    },
    include: {
			topic: true,
		}
  })
  
  const res= {
    ...found,
    topicName: found?.topic.name
  }

  return res as CategoryDAO
}


export async function categorizeResponse(topicResponseId: string) {
  const found = await prisma.topicResponse.findUnique({
    where: {
      id: topicResponseId
    },
    include: {
      topic: true,
      conversation: true,
    }
  })

  if (!found) return  

  const conversation= found.conversation
  const topic= found.topic

  

  const TRABAJO_ASSISTANT_ID= await getValue("TRABAJO_ASSISTANT_ID")
  if (!TRABAJO_ASSISTANT_ID) {
      console.log("TRABAJO_ASSISTANT_ID is not defined")
      return
  } 
  
  const response= found.respuestaPlanteo

  console.log("categorizing response")
  console.log("response:", response)
  console.log("ASSISTANT_ID:", TRABAJO_ASSISTANT_ID)  
  
  const categoria= await categorizeAssistant(response, TRABAJO_ASSISTANT_ID)
  console.log("categoria:", categoria)

  if (!categoria) {
    console.log("Assistant could not categorize the response")
    return
  }

  // find category by name
  const category= await prisma.category.findFirst({
    where: {
      name: categoria,
      topicId: topic.id
    }
  })

  if (!category) {
    console.log(`Category ${categoria} not found for topic ${topic.name}`)
    return
  }

  console.log("category found! updating")

  // update topicResponse
  const updated= await prisma.topicResponse.update({
    where: {
      id: topicResponseId
    },
    data: {
      category: {
        connect: {
          id: category.id
        }
      }
    }
  })
  
}

export async function categorizeAssistant(response: string, assistantId: string) {

  try {

    const openai = new OpenAI();

    const createdThread = await openai.beta.threads.create({
      messages: [
          {
          "role": "user",
          "content": response
          }
      ]
      })

    console.log("creating run for categorizeAssistant")
    let run = await openai.beta.threads.runs.create(createdThread.id, { assistant_id: assistantId, model: "gpt-4-turbo-preview" })

    const runId= run.id
    let status= run.status
    while (true) {
      run = await openai.beta.threads.runs.retrieve(
          createdThread.id,
          runId,
      )

      status= run.status
      if (status === "completed" || status === "failed" || status === "cancelled" || status === "expired") {
          break
      }

      const timeToSleep= 1
      console.log("sleeping...")
      await new Promise(resolve => setTimeout(resolve, timeToSleep * 1000))
    }

    if (status === "failed" || status === "cancelled" || status === "expired") {
        console.log("run is not 'completed'")
        return
    }

    const threadMessages = await openai.beta.threads.messages.list(run.thread_id)
    for (const message of threadMessages.data) {
      if (message.role === "assistant" && message.content[0].type === "text") {
        
        const category = message.content[0].text.value;
        return category; // Devuelve la primera categoría encontrada
      }
    }

    return null

  } catch (error) {
    console.log("error: ", error)                
  }    

}