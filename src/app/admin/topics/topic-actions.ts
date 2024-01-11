"use server"
  
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { TopicDAO, TopicFormValues, createTopic, updateTopic, deleteTopic, getTopicDAO, toggleTopicEnabled, getEnabledTopicsDAOBySlug } from "@/services/topic-services"


export async function getTopicDAOAction(id: string): Promise<TopicDAO | null> {
    return getTopicDAO(id)
}

export async function getEnabledTopicsDAOBySlugAction(slug: string): Promise<TopicDAO[] | null> {
    const found= await getEnabledTopicsDAOBySlug(slug)
    return found
}

export async function createOrUpdateTopicAction(id: string | null, data: TopicFormValues): Promise<TopicDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateTopic(id, data)
    } else {
        updated= await createTopic(data)
    }     

    revalidatePath("/admin/topics")

    return updated as TopicDAO
}

export async function toggleTopicEnabledAction(id: string): Promise<TopicDAO | null> {    
    const updated= await toggleTopicEnabled(id)

    revalidatePath("/admin/topics")

    return updated as TopicDAO
}
export async function deleteTopicAction(id: string): Promise<TopicDAO | null> {    
    const deleted= await deleteTopic(id)

    revalidatePath("/admin/topics")

    return deleted as TopicDAO
}

