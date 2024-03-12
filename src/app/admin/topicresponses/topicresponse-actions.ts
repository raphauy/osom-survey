"use server"
  
import { categorizeResponse } from "@/services/category-services"
import { getActiveConversation } from "@/services/conversationService"
import { TopicResponseDAO, TopicResponseFormValues, createTopicResponse, deleteTopicResponse, getTopicResponseDAO, getActiveTopicResponsesDAOByPhone, updateTopicResponse, getTopicResponseDAOByConversationAndTopicId } from "@/services/topicresponse-services"
import { revalidatePath } from "next/cache"


export async function getTopicResponseDAOAction(id: string): Promise<TopicResponseDAO | null> {
    return getTopicResponseDAO(id)
}

export async function createOrUpdateTopicResponseAction(id: string | null, data: TopicResponseFormValues): Promise<boolean | null> {       
    let updated= null
    if (id) {
        updated= await updateTopicResponse(id, data)
    } else {
        updated= await createTopicResponse(data)
    }     
    if (!updated) return false

    revalidatePath("/admin/topicResponses")
    revalidatePath("/admin/chat")

    return true
}

export async function createOrUpdateTopicResponseFromFunctions(data: TopicResponseFormValues): Promise<boolean | null> {
    const RAFFO_CLIENT_ID= process.env.RAFFO_CLIENT_ID
    if (!RAFFO_CLIENT_ID) throw new Error("RAFFO_CLIENT_ID not found")
    const phone= data.phone
    const activeConversation= await getActiveConversation(phone, RAFFO_CLIENT_ID)
    if (!activeConversation) return false
    
    const found= await getTopicResponseDAOByConversationAndTopicId(activeConversation.id, data.topicId)
    let updated= null
    if (!found) {
        updated= await createTopicResponse(data)
    } else {
        updated= await updateTopicResponse(found.id, data)
    }

    if (!updated) return false

    return true
}

export async function getTopicResponsesDAOByPhoneAction(phone: string): Promise<TopicResponseDAO[]> {
    const found= await getActiveTopicResponsesDAOByPhone(phone)
    return found as TopicResponseDAO[]
}

export async function deleteTopicResponseAction(id: string): Promise<boolean> {    
    const deleted= await deleteTopicResponse(id)

    if (!deleted) return false

    revalidatePath("/admin/topicResponses")
    revalidatePath("/admin/chat")

    return true
}

export async function categorizeResponseAction(topicResponseId: string) {
    await categorizeResponse(topicResponseId)

    revalidatePath("/admin/topicResponses")

    return true
}