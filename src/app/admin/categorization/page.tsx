import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { getTopicsSumarizeNotProcessed } from "@/services/category-services"
import { getSurveyCount } from "@/services/survey-services"
import ControlBox from "./control-box"

export default async function ResultsPage() {

  const topicSumarize= await getTopicsSumarizeNotProcessed()
  const responsesCount= topicSumarize.reduce((acc, c) => acc + c.count, 0)

  return (
    <div className="flex flex-col w-full max-w-lg">
      <p className="w-full mt-5 text-2xl font-bold text-center">Pendientes</p>
      <p className="mb-2 mt-7">Respuetas Pendientes de categorizar:</p>
      <div className="space-y-5">
        {topicSumarize.map(({ name, count, percentage }) => (
          <div key={name} className="w-full gap-4">
            <div className="flex justify-between">
              <p>{name}</p>
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
      <p className="mt-5 text-right">Total: <span className="font-bold">{Intl.NumberFormat("es-UY").format(responsesCount)}</span></p>

      <Separator className="my-5"/>

      <ControlBox />
    </div>
  )
}
