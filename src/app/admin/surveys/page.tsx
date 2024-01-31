import { getSurveysDAO } from "@/services/survey-services"
import { SurveyDialog } from "./survey-dialogs"
import { DataTable } from "./survey-table"
import { columns } from "./survey-columns"

export default async function UsersPage() {
  
  const data= await getSurveysDAO()
  const departaments= data.map((survey) => survey.departamentoResidencia ? survey.departamentoResidencia : "")
  const diferentDepartaments= Array.from(new Set(departaments))
  const votosPartido= data.map((survey) => survey.votoPartido ? survey.votoPartido : "")
  const diferentVotosPartido= Array.from(new Set(votosPartido))

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <SurveyDialog />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Survey" departments={diferentDepartaments} votosPartido={diferentVotosPartido}/>
      </div>
    </div>
  )
}
  
