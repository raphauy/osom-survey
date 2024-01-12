import { getFinalSystemMessage, getSystemMessage, getSystemMessageForSocialExperiment, messageArrived } from "@/services/conversationService";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OpenAI } from "openai";
import { functions, runFunction } from "../../../services/functions";
import { getClient, getFirstClient } from "@/services/clientService";
import { getCurrentUser } from "@/lib/auth";
import { getTopicResponsesDAOByPhone } from "@/services/topicresponse-services";
import { getTopicsDAO } from "@/services/topic-services";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

//export const runtime = "edge";

export async function POST(req: Request) {

  const { messages } = await req.json()


  const client= await getFirstClient()
  if (!client) {
    return new Response("Client not found", { status: 404 })
  }
  const prompt= client.promptHidratated
  if (!prompt) {
    return new Response("Client prompt not found", { status: 404 })
  }

  const currentUser= await getCurrentUser()
  const phone= currentUser?.email || "web-chat"

  const topicsResponses= await getTopicResponsesDAOByPhone(phone)
  const topics= await getTopicsDAO()
  const topicsWithoutResponses= topics.filter(topic => !topicsResponses.find(topicResponse => topicResponse.topicId === topic.id))  

  messages.unshift(getSystemMessage(prompt))
  const finalSystemMessage= getFinalSystemMessage(topicsResponses, topicsWithoutResponses)
  console.log(finalSystemMessage)  
  messages.push(finalSystemMessage)
  
  // if (messages.length === 2) {
  //   console.log(messages)  
  // }

  // check if the conversation requires a function call to be made
  const initialResponse = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages,
    temperature: 0,
    stream: true,
    functions,
    function_call: "auto",
  })

  // @ts-ignore
  const stream = OpenAIStream(initialResponse, {
    experimental_onFunctionCall: async (
      { name, arguments: args },
      createFunctionCallMessages,
    ) => {
      const result = await runFunction(name, args, client.id, phone);
      const newMessages = createFunctionCallMessages(result);
      return openai.chat.completions.create({
        //model: "gpt-3.5-turbo-0613",
        model: "gpt-4-1106-preview",
        stream: true,
        messages: [...messages, ...newMessages],        
      });
    },
    // onStart: async () => {
    //   console.log("start")
    //   const text= messages[messages.length - 1].content
    //   console.log("text: " + text)
      
    //   const messageStored= await messageArrived(phone, text, client.id, "user")
    //   if (messageStored) console.log("user message stored")

    // },
    // onCompletion: async (completion) => {
    //   console.log("completion: ", completion)
    //   // check if is text
    //   if (!completion.includes("function_call")) {
    //     const messageStored= await messageArrived(phone, completion, client.id, "assistant")
    //     if (messageStored) console.log("assistant message stored")
    //   }
    // },
  });



  return new StreamingTextResponse(stream);
}
