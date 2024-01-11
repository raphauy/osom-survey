import { TopicResponseDialog } from "./topicresponse-dialogs"
import { DataTable } from "./topicresponse-table"
import { columns } from "./topicresponse-columns"
import { getTopicResponsesDAO } from "@/services/topicresponse-services"
import { getTopicsDAO } from "@/services/topic-services"

export default async function UsersPage() {
  
  const data= await getTopicResponsesDAO()
  const topics= await getTopicsDAO()
  const topicNames= topics.map((topic) => topic.name)

  return (
    <div className="w-full">      

      <h1 className="my-2 text-3xl font-semibold text-center text-gray-800 dark:text-gray-200">Respuestas</h1>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="TopicResponse" topics={topicNames} />
      </div>
    </div>
  )
}
  
