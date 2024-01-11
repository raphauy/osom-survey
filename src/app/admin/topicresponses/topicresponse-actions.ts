"use server"
  
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { TopicResponseDAO, createTopicResponse, updateTopicResponse, deleteTopicResponse, TopicResponseFormValues, getTopicResponsesDAOByPhone, getTopicResponsesDAO, getTopicResponseDAO, getTopicResponseDAOByPhoneAndTopicId } from "@/services/topicresponse-services"


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
    const phone= data.phone
    const found= await getTopicResponseDAOByPhoneAndTopicId(phone, data.topicId)
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
    const found= await getTopicResponsesDAOByPhone(phone)
    return found as TopicResponseDAO[]
}

export async function deleteTopicResponseAction(id: string): Promise<TopicResponseDAO | null> {    
    const deleted= await deleteTopicResponse(id)

    revalidatePath("/admin/topicResponses")
    revalidatePath("/admin/chat")

    return deleted as TopicResponseDAO
}

