import { createOrUpdateTopicResponseFromFunctions } from "@/app/admin/topicresponses/topicresponse-actions";
import { getEnabledTopicDAOByClientAndName } from "./topic-services";

export const functions= [
  {
    name: "obtenerInstrucciones",
    description:
      "Devuelve las instrucciones relativas al tema seleccionado por el usuario.",
    parameters: {
      type: "object",
      properties: {
        tema: {
          type: "string",
          description: "nombre del tema seleccionado por el usuario, ejemplo: 'INSEGURIDAD', 'TRABAJO', 'SALUD', etc."          
        },
      },
      required: ["tema"],
    },    
  },
  {
    name: "registrarRespuestas",
    description:
      "Registra en el sistema de encuestas las respuestas del usuario sobre el planteo y la solución del problema referente al tema seleccionado.",
    parameters: {
      type: "object",
      properties: {
        tema: {
          type: "string",
          description: "nombre del tema al que hace referencia el planteo del problema, ejemplo: 'INSEGURIDAD', 'TRABAJO', 'SALUD', etc."
        },
        respuestaPlanteo: {
          type: "string",
          description: "respuesta del usuario referente al planteo de un problema sobre el tema seleccionado, debes resumir la respuesta a un concepto como 'Falta de empleo', 'Poca de seguridad', 'Basura en las calles', 'Ruidos molestos', etc. El texto de este parámetro debe incluir secuencias de escape Unicode para caracteres especiales, como tildes y eñes. Por ejemplo, usar '\\u00e1' en lugar de 'á'."
        },
        respuestaSolucion: {
          type: "string",
          description: "respuesta del usuario referente a la solución del problema planteado anteriormente. El texto de este parámetro debe incluir secuencias de escape Unicode para caracteres especiales, como tildes y eñes. Por ejemplo, usar '\\u00e1' en lugar de 'á'."
        },
        evaluacionDeIA: {
          type: "string",
          description: "evaluación por parte de la IA sobre la problemática del usuario, evaluar cuán grave es este problema para el usaurio. Los valores son van del 1 al 10, siendo 1 el menos grave y 10 el más grave."
        },
      },
      required: ["tema", "respuestaPlanteo", "respuestaSolucion", "evaluacionDeIA"],
    },
  },
];


export async function obtenerInstrucciones(tema: string, clientId: string){
  console.log("obtenerInstrucciones")
  console.log("\ttema: " + tema)
  const topic= await getEnabledTopicDAOByClientAndName(clientId, tema)
  if (!topic) {
    console.log("\ttopic not found")
    return "Tema no encontrado"
  }
  console.log("\tinstructions: " + topic.prompt)
  
  return topic.prompt
}

export async function registrarRespuestas(tema: string, respuestaPlanteo: string, respuestaSolucion: string, evaluacionDeIA: string, clientId: string, phone: string){
  respuestaPlanteo= decodeUnicode(respuestaPlanteo)  
  respuestaSolucion= decodeUnicode(respuestaSolucion)
  console.log("registrarRespuestas")
  console.log("\ttema: " + tema)
  console.log("\trespuestaPlanteo: " + respuestaPlanteo)
  console.log("\trespuestaSolucion: " + respuestaSolucion)
  console.log("\tevaluacionDeIA: " + evaluacionDeIA)
  const topic= await getEnabledTopicDAOByClientAndName(clientId, tema)
  if (!topic) {
    console.log("\ttopic not found")
    return "Tema no encontrado"
  }
  const topicResponseData= {
    phone,
    respuestaPlanteo,
    respuestaSolucion,
    gravedad: parseInt(evaluacionDeIA),
    topicId: topic.id,
  }
  const created= await createOrUpdateTopicResponseFromFunctions(topicResponseData)
  if (!created) return "Error al registrar la respuesta"

  const response= `Respuesta registrada para tema ${tema}. No hace falta decirle al usuario que la respuesta fue registrada. Simplemente preguntar al usuario si quiere tratar otro tema.`
  console.log("\tresponse: " + response)  

  return response
}

function decodeUnicode(text: string): string {
  const reemplazos: { [key: string]: string } = {
    '\\u00e1': 'á', // á
    '\\u00e9': 'é', // é
    '\\u00ed': 'í', // í
    '\\u00f3': 'ó', // ó
    '\\u00fa': 'ú', // ú
    '\\u00f1': 'ñ', // ñ
    '\\u00c1': 'Á', // Á
    '\\u00c9': 'É', // É
    '\\u00cd': 'Í', // Í
    '\\u00d3': 'Ó', // Ó
    '\\u00da': 'Ú', // Ú
    '\\u00d1': 'Ñ', // Ñ
    // Agrega más reemplazos si son necesarios
  };

  return text.replace(/\\u00e1|\\u00e9|\\u00ed|\\u00f3|\\u00fa|\\u00f1|\\u00c1|\\u00c9|\\u00cd|\\u00d3|\\u00da|\\u00d1/g, (match) => reemplazos[match]);
}


export async function runFunction(name: string, args: any, clientId: string, phone: string) {
  switch (name) {
    case "obtenerInstrucciones":
      return obtenerInstrucciones(args["tema"], clientId);
    case "registrarRespuestas":
      return registrarRespuestas(args["tema"], args["respuestaPlanteo"], args["respuestaSolucion"], args["evaluacionDeIA"], clientId, phone);
    default:
      return null;
  }
}

