"use server"
  
import { deleteConversation, getActiveConversation } from "@/services/conversationService"
import { TopicResponseDAO, TopicResponseFormValues, createTopicResponse, deleteTopicResponse, getTopicResponseDAO, getActiveTopicResponsesDAOByPhone, updateTopicResponse, getTopicResponseDAOByConversationAndTopicId } from "@/services/topicresponse-services"
import { revalidatePath } from "next/cache"


export async function deleteConversationAction(id: string): Promise<boolean> {
    const deleted= await deleteConversation(id)

    if (!deleted) return false

    return true
}
