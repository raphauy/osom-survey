import { prisma } from "@/lib/db";
import { OpenAI } from "openai";
import { ChatCompletionFunctionMessageParam, ChatCompletionMessageParam, ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from "openai/resources/index.mjs";
import { functions, obtenerInstrucciones, registrarRespuestas } from "./functions";
import { TopicResponseDAO, getActiveTopicResponsesDAOByPhone } from "./topicresponse-services";
import { TopicDAO, getEnabledTopicsDAOByClient, getEnabledTopicsDAOBySlug, getTopicsDAO } from "./topic-services";
import { sendWapMessage } from "./osomService";

export default async function getConversations() {

  const found = await prisma.conversation.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      client: true
    }
  })

  return found;
}

export async function getConversationsOfClient(clientId: string) {

  const found = await prisma.conversation.findMany({
    where: {
      clientId
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      client: true,
      messages: true
    },
    take: 100
  })

  // order the conversations by the last message date
  found.sort((a, b) => {
    if (a.messages.length === 0) return -1
    if (b.messages.length === 0) return 1
    const lastMessageA= a.messages[a.messages.length - 1]
    const lastMessageB= b.messages[b.messages.length - 1]
    return lastMessageB.createdAt.getTime() - lastMessageA.createdAt.getTime()
  })

  return found;
}

export async function getConversationsCount(clientId: string) {
  const count= await prisma.conversation.count({
      where: {
          clientId: clientId
      }
  })

  return count
}
// conversations with at least one topic response
export async function getConversationsWithTopicResponseCount(clientId: string) {
  const count= await prisma.conversation.count({
      where: {
          clientId: clientId,
          topicResponses: {
            some: {}
          }
      }
  })

  return count

}

export async function getMessagesCount(clientId: string) {
  const count= await prisma.message.count({
      where: {
          conversation: {
              clientId: clientId
          }
      }
  })

  return count
}


// an active conversation is one that has a message in the last 10 minutes
export async function getActiveConversation(phone: string, clientId: string) {
  
  // 1 year in minutes
  const toleranceInMinutes= 525600

  const found = await prisma.conversation.findFirst({
    where: {
      phone,
      clientId,        
      messages: {
        some: {
          createdAt: {
            gte: new Date(Date.now() - toleranceInMinutes * 60 * 1000)
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      client: true,
      messages: {
        orderBy: {
          createdAt: 'asc',
        },
      }
    }
  })

  return found;
}

export async function getActiveMessages(phone: string) {
  const clientId= process.env.RAFFO_CLIENT_ID
  if (!clientId) throw new Error("RAFFO_CLIENT_ID not defined")

  const activeConversation= await getActiveConversation(phone, clientId)
  if (!activeConversation) return null

  const messages= activeConversation.messages

  return messages
}


export async function getConversation(id: string) {

  const found = await prisma.conversation.findUnique({
    where: {
      id
    },
    include: {
      client: true,
      messages:  {
        orderBy: {
          createdAt: 'asc',
        },
      },
      survey: true
    },
  })

  return found
}

// find an active conversation or create a new one to connect the messages
export async function messageArrived(phone: string, text: string, clientId: string, role: string, name?: string) {

  const activeConversation= await getActiveConversation(phone, clientId)
  if (activeConversation) {
    const message= await createMessage(activeConversation.id, role, text, name)
    return message    
  } else {
    const created= await prisma.conversation.create({
      data: {
        phone,
        clientId,
      }
    })
    const message= await createMessage(created.id, role, text, name)    
    return message   
  }
}

export interface gptPropertyData {
  titulo: string
  url: string
  distance: number
}

export async function processMessage(id: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  
  const message= await prisma.message.findUnique({
    where: {
      id
    },
    include: {
      conversation: {
        include: {
          messages: true,
          client: true
        }
      }
    }
  })
  if (!message) throw new Error("Message not found")

  const conversation= message.conversation
  
  //const messages= getGPTMessages(conversation.messages as ChatCompletionMessageParam[])
  if (!conversation.client.prompt) throw new Error("Client not found")
  const messages: ChatCompletionMessageParam[]= getGPTMessages(conversation.messages as ChatCompletionUserOrSystemOrFunction[], conversation.client.prompt, conversation.phone)

  const topicsResponses= await getActiveTopicResponsesDAOByPhone(conversation.phone)
  //const topics= await getTopicsDAO()
  const topics= await getEnabledTopicsDAOByClient(conversation.clientId)
  console.log("topics: ", topics)
  
  const topicsWithoutResponses= topics.filter(topic => !topicsResponses.find(topicResponse => topicResponse.topicId === topic.id))  

  const finalSystemMessage= getFinalSystemMessage(topicsResponses, topicsWithoutResponses)
  messages.push(finalSystemMessage)

  // messages.forEach(message => {
  //   if (message.role === 'function') {
  //     console.log("function message found")      
  //     message.name= "registrarRespuestas"
  //   }
  // })

  console.log("gptMessages: ", messages)

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: messages,
    temperature: 0,
    functions,
    function_call: "auto",
  })

  
  let wantsToUseFunction = initialResponse.choices[0].finish_reason == "function_call"
  const usage= initialResponse.usage
  console.log("usage:")
  console.log(usage)  

  console.log("wantsToUseFunction: ", wantsToUseFunction)
  

  let assistantResponse: string | null = ""
	let content: [] | string = []
	// Step 2: Check if ChatGPT wants to use a function
	if(wantsToUseFunction){
		// Step 3: Use ChatGPT arguments to call your function
    if (!initialResponse.choices[0].message.function_call) throw new Error("No function_call message")

		if(initialResponse.choices[0].message.function_call.name == "obtenerInstrucciones"){
			let argumentObj = JSON.parse(initialResponse.choices[0].message.function_call.arguments)      
      const tema= argumentObj.tema
			content = await obtenerInstrucciones(tema, conversation.clientId)

			messages.push(initialResponse.choices[0].message)
			messages.push({
				role: "function",
				name: "obtenerInstrucciones",
				content: JSON.stringify(content),
			})
    }

    if(initialResponse.choices[0].message.function_call.name == "registrarRespuestas"){
			let argumentObj = JSON.parse(initialResponse.choices[0].message.function_call.arguments)      
      const tema= argumentObj.tema
      const respuestaPlanteo= argumentObj.respuestaPlanteo
      const respuestaSolucion= argumentObj.respuestaSolucion
      const evaluacionDeIA= argumentObj.evaluacionDeIA

      content = await registrarRespuestas(tema, respuestaPlanteo, respuestaSolucion, evaluacionDeIA, conversation.clientId, conversation.phone)

      messages.push(initialResponse.choices[0].message)
      messages.push({
        role: "function",
        name: "registrarRespuestas",
        content: JSON.stringify(content),
      })

      await messageArrived(conversation.phone, content, conversation.clientId, "function", "registrarRespuestas")
	  }


    // second invocation of ChatGPT to respond to the function call
    let step4response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
    });
    assistantResponse = step4response.choices[0].message.content
    
	} else {
    assistantResponse = initialResponse.choices[0].message.content    
  }

  console.log("assistantResponse: ", assistantResponse)  

  if (assistantResponse) {
    await messageArrived(conversation.phone, assistantResponse, conversation.clientId, "assistant")
    console.log("message stored")
    sendWapMessage(conversation.phone, assistantResponse, false, conversation.clientId)
  } else {
    console.log("assistantResponse is null")
  }   
  
  
}

type ChatCompletionUserOrSystemOrFunction= ChatCompletionUserMessageParam | ChatCompletionSystemMessageParam | ChatCompletionFunctionMessageParam

//function getGPTMessages(messages: (ChatCompletionUserMessageParam | ChatCompletionSystemMessageParam)[], clientPrompt: string) {
function getGPTMessages(messages: ChatCompletionUserOrSystemOrFunction[], clientPrompt: string, topicsDone: string) {

  const systemPrompt= getSystemMessage(clientPrompt)

  // const gptMessages: ChatCompletionMessageParam[]= [systemPrompt]
  const gptMessages: ChatCompletionUserOrSystemOrFunction[]= [systemPrompt]
  for (const message of messages) {
    let content= message.content
    if (Array.isArray(content)) {
      content= content.join("\n")
    } else if (content === null) {
      content= ""
    }

    // @ts-ignore
    gptMessages.push({
      role: message.role,
      content,
      name: message.name ? message.name : undefined
    })
  }
  return gptMessages
}


export function getSystemMessage(prompt: string): ChatCompletionSystemMessageParam {  
 
  const content= prompt

  const systemMessage: ChatCompletionMessageParam= {
    role: "system",
    content
  }
  return systemMessage
  
}

export function getFinalSystemMessage(topicResponses: TopicResponseDAO[], topicsWithoutResponses: TopicDAO[]): ChatCompletionSystemMessageParam {  
  const topicsDone= topicResponses.map(topic => topic.topic.name).join(", ")
  const topicsUndone= topicsWithoutResponses.map(topic => topic.name).join(", ")
 
  let tecnicalContent= "Temas ya registrados: "
  if (topicsDone)
    tecnicalContent+= topicsDone + ". Solo se debe volver a registrar los temas ya registrados si el usuario proporciona información adicional, haz un resumen sobre el tema en cuestión en base a la conversación."
  else tecnicalContent+= "NINGUNO."

  tecnicalContent+= "\nTemas que aún no se registraron: "
  if (topicsUndone)
    tecnicalContent+= topicsUndone + "."
  else tecnicalContent+= "NINGUNO."

  const content= "\n" + tecnicalContent

  const systemMessage: ChatCompletionMessageParam= {
    role: "system",
    content
  }
  return systemMessage  
}


export function getSystemMessageForSocialExperiment() {
  const systemMessage: ChatCompletionMessageParam= {
    role: "system",
    content: `Eres un asistente social que trabaja para la comuna.
    Debes hablar con acento uruguayo.
    Tu objetivo es dialogar con un vecino de barrio y averiguar cuáles son sus problemas y necesidades.
    Para lograr tu objetivo puedes preguntarle por aspectos de seguridad, sentimiento de pertenencia, servicios públicos, etc.
    Debes ser amable y empático.
    Debes ser paciente y tolerante.
    Debes ser respetuoso y no juzgar al vecino.
    Se quiere obtener información sobre el sentimiento de las personas, no sobre los barrios específicamente.
    Debes recopilar información mediante preguntas pertinentes y en función de las respuestas del usuario.
    La información recopilada en forma de diálogo entre tú y el vecino servirá para que la ONG pueda realizar un diagnóstico de la situación del barrio y del sentimiento ciudadano.`
  }
  return systemMessage
  
}

function createMessage(conversationId: string, role: string, content: string, name?: string) {
  const created= prisma.message.create({
    data: {
      role,
      content,
      conversationId,
      name
    }
  })

  return created
}
  


export async function updateConversation(id: string, role: string, content: string) {

  const newMessage= await prisma.message.create({
    data: {
      role,
      content,
      conversationId: id,
    }
  })
  
  const updated= await prisma.conversation.update({
    where: {
      id
    },
    data: {
      messages: {
        connect: {
          id: newMessage.id
        }
      }
    }
    })

  return updated
}


export async function deleteConversation(id: string) {
  
  const deleted= await prisma.conversation.delete({
    where: {
      id
    },
  })

  return deleted
}