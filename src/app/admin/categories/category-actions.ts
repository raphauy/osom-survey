"use server"
  
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { CategoryDAO, CategoryFormValues, createCategory, updateCategory, getFullCategoryDAO, deleteCategory } from "@/services/category-services"

import { getComplentaryTopicResponses, setTopicResponses} from "@/services/category-services"
import { TopicResponseDAO } from "@/services/topicresponse-services"
    

export async function getCategoryDAOAction(id: string): Promise<CategoryDAO | null> {
    return getFullCategoryDAO(id)
}

export async function createOrUpdateCategoryAction(id: string | null, data: CategoryFormValues): Promise<CategoryDAO | null> {       
    let updated= null
    if (id) {
        updated= await updateCategory(id, data)
    } else {
        // const currentUser= await getCurrentUser()
        // if (!currentUser) {
        //   throw new Error("User not found")
        // }
        // updated= await createCategory(data, currentUser.id)

        updated= await createCategory(data)
    }     

    revalidatePath("/admin/categorys")

    return updated as CategoryDAO
}

export async function deleteCategoryAction(id: string): Promise<CategoryDAO | null> {    
    const deleted= await deleteCategory(id)

    revalidatePath("/admin/categorys")

    return deleted as CategoryDAO
}
    
export async function getComplentaryTopicResponsesAction(id: string): Promise<TopicResponseDAO[]> {
    const complementary= await getComplentaryTopicResponses(id)

    return complementary as TopicResponseDAO[]
}

export async function setTopicResponsesAction(id: string, topicResponses: TopicResponseDAO[]): Promise<boolean> {
    const res= setTopicResponses(id, topicResponses)

    revalidatePath("/admin/categorys")

    return res
}


