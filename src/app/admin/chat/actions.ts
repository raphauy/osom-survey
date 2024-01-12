"use server"

import { getActiveMessages } from "@/services/conversationService"

export async function getActiveMessagesAction(phone: string){
    const messages= await getActiveMessages(phone)
    return messages
}