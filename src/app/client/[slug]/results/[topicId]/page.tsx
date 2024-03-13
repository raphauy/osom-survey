import { Progress } from "@/components/ui/progress"
import { getCategoriesSumarize } from "@/services/category-services"
import { getTopicDAO } from "@/services/topic-services"
import DonutPage from "../donut-chart"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"

type Props= {
  params: {
    topicId: string
  }
}
export default async function ResultsPage({ params }: Props) {
  const { topicId }= params
  if (!topicId) return <div>TopicId is required</div>

  const topic= await getTopicDAO(topicId)

  const categorySumarize= await getCategoriesSumarize(topicId)
  const total= categorySumarize.reduce((acc, c) => acc + c.count, 0)

  const data= categorySumarize.map(c => {
    return {
      name: c.name,
      value: c.count
    }
  })

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col w-full max-w-lg gap-4">
        <p className="w-full my-5 text-2xl font-bold text-center">Respuestas del tema {topic.name}</p>
        <p className="font-bold">Respuetas categorizadas:</p>
        <div className="space-y-5">
          {categorySumarize.map(({ name, description, count, percentage }) => (
            <div key={name} className="w-full gap-4">
              <div className="flex justify-between">
                <p>{name}</p>
                <div className="grid grid-cols-2 gap-4 text-right w-36">
                  <div className="flex items-center justify-between w-20">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info size={18} />
                        </TooltipTrigger>
                        <TooltipContent className="text-left w-72">
                            <p className="text-sm whitespace-pre-wrap">{description}</p>
                        </TooltipContent>
                    </Tooltip>
                    <p>{Intl.NumberFormat("es-UY").format(count)}</p>
                  </div>
                  <p>({percentage}%)</p>
                </div>
              </div>
              <Progress value={percentage} className="h-3"/>
            </div>
          ))}
        </div>
        <p className="text-right">{Intl.NumberFormat("es-UY").format(total)} respuestas</p>
      </div>
      <DonutPage data={data} innerRadius={144} outerRadius={192} />
    </div>
  )
}
