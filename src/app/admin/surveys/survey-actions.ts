"use server"
  
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "@/lib/auth"
import { SurveyDAO, SurveyFormValues, createSurvey, updateSurvey, deleteSurvey, getSurveyDAO, createOrUpdateSurvey } from "@/services/survey-services"


export async function getSurveyDAOAction(id: string): Promise<SurveyDAO | null> {
    return getSurveyDAO(id)
}

export async function createOrUpdateSurveyAction(data: SurveyFormValues): Promise<SurveyDAO | null> {       
    const updated= await createOrUpdateSurvey(data)

    revalidatePath("/admin/surveys")

    return updated as SurveyDAO
}

export async function deleteSurveyAction(id: string): Promise<SurveyDAO | null> {    
    const deleted= await deleteSurvey(id)

    revalidatePath("/admin/surveys")

    return deleted as SurveyDAO
}
    
