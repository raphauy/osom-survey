import { getEnabledTopicsDAOByClient } from "@/services/topic-services"
import { getDataClients, updatePrompt } from "../clients/(crud)/actions"
import { PromptForm } from "./prompt-form"
import { FormLabel } from "@/components/ui/form"

export default async function PromptPage() {
    const clients= await getDataClients()

  
    // const topics= await getEnabledTopicsDAOByClient(raffoClientId)
    // console.log("topicS: ")
    // topics.forEach(element => {
    //   console.log("\t", element.name)    
    // })
    // const client= await getClient(raffoClientId)
    // if (!client?.prompt) return <div>prompt not found</div>
  
    // const topicsStr= topics.map(topic => topic.name).join(", ")  
    // const promptHidratated= client.prompt.replace("{TEMAS}", topicsStr)
    // console.log(promptHidratated)
  

    return (
        <div className="container mt-10 space-y-5">
            <p className="mb-4 text-3xl font-bold text-center">Prompt principal</p>
            {
                clients.map(client => {
                    if (!client.prompt) return <div>prompt not found</div>
                    
                    return (
                    <div key={client.id} 
                        className="w-full p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{client.nombre}</p>
                        <PromptForm id={client.id} update={updatePrompt} prompt={client.prompt || ""} />

                        <p className="mt-5 mb-2 text-sm font-bold">Prompt hidratado:</p>
                        <div className="p-4 whitespace-pre-wrap bg-white border rounded-md w-fit">
                            {client.promptHidratated}
                        </div>
                    </div>
                )})
            }

        </div>
    )
}
