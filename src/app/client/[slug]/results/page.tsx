import { Progress } from "@/components/ui/progress"
import { getTopicsSumarize } from "@/services/category-services"
import { getClientBySlug } from "@/services/clientService"
import { getConversationsCount, getConversationsWithTopicResponseCount } from "@/services/conversationService"
import DonutPage from "./donut-chart"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

interface Props{
  params: {
    slug: string
  },
}

export default async function ResultsPage({ params: { slug } }: Props) {

  const client= await getClientBySlug(slug)
  if (!client) return <div>Cliente no encontrado</div>

  const topicSumarize= await getTopicsSumarize()
  const conversationsCount= await getConversationsCount(client.id)
  const responsesCount= topicSumarize.reduce((acc, c) => acc + c.count, 0)
  const answeredConversationsCount= await getConversationsWithTopicResponseCount(client.id)
  const responsesPercentage= Math.round((answeredConversationsCount / conversationsCount) * 100)

  const data= topicSumarize.map(c => {
    return {
      name: c.name,
      value: c.count
    }
  })
  
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col w-full max-w-lg">
        <p className="w-full mt-5 text-2xl font-bold text-center">Resultados</p>
        <p className="text-center"><span className="font-bold">{Intl.NumberFormat("es-UY").format(conversationsCount)}</span> encuestas</p>
        <p className="mb-8 text-center"><span className="font-bold">{Intl.NumberFormat("es-UY").format(answeredConversationsCount)}</span> encuestas con al menos 1 respuesta  (<span className="font-bold">{responsesPercentage}%</span>)</p>
        <p className="mb-2">Respuetas:</p>
        <div className="space-y-10">
          {topicSumarize.map(({ name, description, count, percentage }) => (
            <div key={name} className="w-full gap-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <p>{name}</p>
                  <Tooltip>
                      <TooltipTrigger asChild>
                          <Info size={18} />
                      </TooltipTrigger>
                      <TooltipContent className="text-left w-72">
                          <p className="mb-5 text-lg font-bold">RRRRR:</p>
                          <p className="text-sm whitespace-pre-wrap">{removeMiddle(description)}</p>
                      </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex justify-end w-20 gap-4">
                  <p>{Intl.NumberFormat("es-UY").format(count)}</p>
                  <p>({percentage}%)</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Progress value={percentage} className="h-3"/>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-5 text-right"><span className="font-bold">{Intl.NumberFormat("es-UY").format(responsesCount)}</span> respuestas</p>        

      </div>
      {/* <DonutPage data={data} /> */}
    </div>
  )
}

function removeMiddle(text: string) {
  return text.replace("Debes esperar a la respuesta de la parte 1 para preguntar la parte 2.\n\n", "")  
}