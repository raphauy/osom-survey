import * as z from "zod"
import { prisma } from "@/lib/db"

export type SurveyDAO = {
	id: string
	phone: string
	createdAt: Date
	updatedAt: Date
	votoPartido: string | null
	preferenciaPartido: string | null
	candidatoPreferencia: string | null
	candidatoInternoPreferencia: string | null
	mediosInformacion: string | null
	edad: string | null
	departamentoResidencia: string | null
	conversationsCount: number
}

export const surveySchema = z.object({
	phone: z.string({required_error: "phone is required."}),
	votoPartido: z.string().optional(),
	preferenciaPartido: z.string().optional(),
	candidatoPreferencia: z.string().optional(),
	candidatoInternoPreferencia: z.string().optional(),
	mediosInformacion: z.string().optional(),
	edad: z.string().optional(),
	departamentoResidencia: z.string().optional(),
})

export type SurveyFormValues = z.infer<typeof surveySchema>


export async function getSurveysDAO() {
  const found = await prisma.survey.findMany({
    orderBy: {
      id: 'asc'
    },
    include: {
      conversations: true
    }
  })
  const res: SurveyDAO[] = found.map(s => {
    return {
      ...s,
      conversationsCount: s.conversations.length
    }
  })

  return res
}

export async function getSurveyDAO(id: string) {
  const found = await prisma.survey.findUnique({
    where: {
      id
    },
    include: {
      conversations: true
    }
  })

  if (!found) {
    return null
  }

  const res: SurveyDAO = {
    ...found,
    conversationsCount: found.conversations.length
  }

  return res
}
    
export async function createSurvey(data: SurveyFormValues) {
  const created = await prisma.survey.create({
    data
  })

  // get conversations of the phone
  const conversations = await prisma.conversation.findMany({
    where: {
      phone: data.phone
    }
  })
  // connect conversations to the survey
  await prisma.survey.update({
    where: {
      id: created.id
    },
    data: {
      conversations: {
        connect: conversations.map(c => ({id: c.id}))
      }
    }
  })

  return created
}

export async function createOrUpdateSurvey(data: SurveyFormValues) {
  const found = await prisma.survey.findUnique({
    where: {
      phone: data.phone
    }
  })

  if (found) {
    const updated = await prisma.survey.update({
      where: {
        id: found.id
      },
      data
    })
    return updated
  } else {
    const created = await createSurvey(data)
    return created
  }
}

export async function updateSurvey(id: string, data: SurveyFormValues) {
  const updated = await prisma.survey.update({
    where: {
      id
    },
    data
  })
  return updated
}

export async function deleteSurvey(id: string) {
  const deleted = await prisma.survey.delete({
    where: {
      id
    },
  })
  return deleted
}
    




