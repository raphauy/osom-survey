"use server"

import getClients, { createClient, deleteClient, editClient, getClient, getClientBySlug, setPrompt, setWhatsAppEndpoing } from "@/services/clientService";
import { Client } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { ClientFormValues } from "./clientForm";
import { getUser } from "@/services/userService";
import { EndpointFormValues } from "../../config/(crud)/endpoint-form";
import { PromptFormValues } from "../../prompts/prompt-form";

export type DataClient = {
    id: string
    nombre: string
    slug: string
    descripcion: string
    url: string
    whatsAppEndpoint: string | null
    prompt?: string | null
    promptHidratated?: string | null
  }
    

export async function getDataClient(clientId: string): Promise<DataClient | null>{
    const client= await getClient(clientId)
    if (!client) return null

    const enabledTopics= client.topics.filter((topic) => topic.enabled)
    const topicsStr= enabledTopics.map((topic) => topic.name).join(", ")

    const data: DataClient= {
        id: client.id,
        nombre: client.name,
        slug: client.slug,
        descripcion: client.description || '',
        url: client.url || '',
        whatsAppEndpoint: client.whatsappEndpoint,
        prompt: client.prompt,
        promptHidratated: client.prompt ? client.prompt.replace("{TEMAS}", topicsStr) : null
    }
    return data
}

export async function getDataClientOfUser(userId: string): Promise<DataClient | null>{
    const user= await getUser(userId)
    if (!user) return null

    const client= user.client
    if (!client) return null

    const data: DataClient= {
        id: client.id,
        nombre: client.name,
        slug: client.slug,
        descripcion: client.description || '',
        url: client.url || '',
        whatsAppEndpoint: client.whatsappEndpoint,
        prompt: client.prompt,
    }
    return data
}

export async function getDataClientBySlug(slug: string): Promise<DataClient | null>{
    
    const client= await getClientBySlug(slug)
    if (!client) return null

    const enabledTopics= client.topics.filter((topic) => topic.enabled)
    const topicsStr= enabledTopics.map((topic) => topic.name).join(", ")

    const data: DataClient= {
        id: client.id,
        nombre: client.name,
        slug: client.slug,
        descripcion: client.description || '',
        url: client.url || '',
        whatsAppEndpoint: client.whatsappEndpoint,
        prompt: client.prompt,
        promptHidratated: client.prompt ? client.prompt.replace("{TEMAS}", topicsStr) : null
    }
    return data
}

export type Percentages = {
    sales: string
    rents: string
}

export async function getDataClients() {
    const clients= await getClients()

    const data: DataClient[] = await Promise.all(
        clients.map(async (client) => {
            // get the names of the topics enabled
            const enabledTopics= client.topics.filter((topic) => topic.enabled)
            const topicsStr= enabledTopics.map((topic) => topic.name).join(", ")

            return {
                id: client.id,
                nombre: client.name,
                slug: client.slug,
                descripcion: client.description || "",
                url: client.url || "",
                whatsAppEndpoint: client.whatsappEndpoint,
                prompt: client.prompt,
                promptHidratated: client.prompt ? client.prompt.replace("{TEMAS}", topicsStr) : null
            };
        })
    );

    revalidatePath(`/admin/config`)
    
    return data    
}

export async function create(data: ClientFormValues): Promise<Client | null> {       
    const created= await createClient(data)

    console.log(created);

    revalidatePath(`/admin`)

    return created
}
  
export async function update(clientId: string, data: ClientFormValues): Promise<Client | null> {  
    const edited= await editClient(clientId, data)    

    revalidatePath(`/admin`)
    
    return edited
}


export async function eliminate(clientId: string): Promise<Client | null> {    
    const deleted= await deleteClient(clientId)

    revalidatePath(`/admin`)

    return deleted
}

export async function updateEndpoint(json: EndpointFormValues) {

    if (!json.whatsappEndpoint || !json.clienteId)
        return

    setWhatsAppEndpoing(json.whatsappEndpoint, json.clienteId)

    revalidatePath(`/admin/config`)
}

export async function updatePrompt(json: PromptFormValues) {

    if (!json.prompt || !json.clienteId)
        return

    setPrompt(json.prompt, json.clienteId)

    revalidatePath(`/admin/prompts`)
}