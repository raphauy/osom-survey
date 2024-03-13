import { getCategorysDAO, getFullCategorysDAO } from "@/services/category-services"
import { CategoryDialog } from "./category-dialogs"
import { DataTable } from "./category-table"
import { columns } from "./category-columns"
import { getTopicsDAO } from "@/services/topic-services"

export default async function UsersPage() {
  
  const data= await getFullCategorysDAO()
  const topics= await getTopicsDAO()
  const topicNames= topics.map((topic) => topic.name)

  return (
    <div className="w-full">      

      <div className="flex justify-end mx-auto my-2">
        <CategoryDialog />
      </div>

      <div className="container p-3 py-4 mx-auto border rounded-md text-muted-foreground dark:text-white">
        <DataTable columns={columns} data={data} subject="Category" topics={topicNames}/>
      </div>
    </div>
  )
}
  
