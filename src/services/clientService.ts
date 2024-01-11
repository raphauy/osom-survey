import { DataClient } from "@/app/admin/clients/(crud)/actions";
import { ClientFormValues } from "@/app/admin/clients/(crud)/clientForm";
import { prisma } from "@/lib/db";


export let prompt= "Eres un agente inmobiliario y quieres ayudar a un cliente a encontrar una propiedad que se ajuste a sus necesidades.\n"
prompt += "Para poder responder te daré el siguiente contexto con información sobre las propiedades preseleccoinadas de nuestra base de datos: CONTEXTO: {CONTEXTO}.\n"
prompt += "Esto es lo que el cliente necesita: '{INPUT_CLIENTE}'.\n"
prompt += "La respuesta debe ser una lista de idPropiedad y estas son las reglas de selección y ordenación:\n"
prompt += "1) identificar intención del cliente (comprar o alquilar) y descartar las propiedades que no pueden cumplir con la intención.\n"
prompt += "2) identificar la zona ingresada por el usuario, la zona puede ser zona, ciudad o departamento. Si no hay alguna propiedad en la zona identificada se debe devolver solamente el texto 'SIN_RESULTADOS'.\n"
prompt += "3) ordenar la lista de mayor a menor coincidencia entre el input del cliente y la información de la propiedad.\n"
prompt += "4) en la ordenación priorizar la zona.\n"
prompt += "Ejemplo de tu respuesta: 120, 330, 253, 401.\n"
prompt += "La respuesta debe ser solo la lista de los idPropiedad seleccionadas y ordenadas, sin explicación.\n"


export default async function getClients() {

  const found = await prisma.client.findMany({
    orderBy: {
      name: 'asc',
    },
    include: {
      users: true,
      topics: true
    }
  })

  return found;
};


export async function getClient(id: string) {

  const found = await prisma.client.findUnique({
    where: {
      id
    },
    include: {
      users: true,
      topics: true
    }
  })

  return found
}

export async function getFirstClient(): Promise<DataClient | null> {
  
    const client = await prisma.client.findFirst({
      orderBy: {
        name: 'asc',
      },
      include: {
        topics: true
      }
    })

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

export async function getClientBySlug(slug: string) {

  const found = await prisma.client.findUnique({
    where: {
      slug
    },
    include: {
      users: true,
      topics: true
    }
  })

  return found
}

export async function createClient(data: ClientFormValues) {
  
  const slug= data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
  const created= await prisma.client.create({
    data: {
      ...data,
      slug
    }
  })

  return created
}

export async function editClient(id: string, data: ClientFormValues) {
  console.log(data);
  
  const created= await prisma.client.update({
    where: {
      id
    },
    data
  })

  return created
}

export async function deleteClient(id: string) {
  
  const deleted= await prisma.client.delete({
    where: {
      id
    },
  })

  return deleted
}

export async function setWhatsAppEndpoing(whatsappEndpoint: string, clientId: string) {
  const client= await prisma.client.update({
    where: {
      id: clientId
    },
    data: {
      whatsappEndpoint
    }
  })

  return client  

  
}

export async function setPrompt(prompt: string, clientId: string) {
  const client= await prisma.client.update({
    where: {
      id: clientId
    },
    data: {
      prompt
    }
  })

  return client   
}

