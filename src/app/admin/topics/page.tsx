import { getEnabledTopicsDAOByClient, getTopicsDAO } from "@/services/topic-services"
import { TopicDialog } from "./topic-dialogs"
import { DataTable } from "./topic-table"
import { columns } from "./topic-columns"
import { getClient } from "@/services/clientService"

export default async function UsersPage() {
  
  const data= await getTopicsDAO()
  const raffoClientId= process.env.RAFFO_CLIENT_ID
  if (!raffoClientId) return <div>RAFFO_CLIENT_ID not found</div>

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <TopicDialog clientId={raffoClientId} />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Topic"/>      
      </div>
    </div>
  )
}
  
