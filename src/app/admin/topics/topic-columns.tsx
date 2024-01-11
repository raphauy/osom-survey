"use client"

import { Button } from "@/components/ui/button"
import { TopicDAO } from "@/services/topic-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Ban, CheckCircle2 } from "lucide-react"
import { format } from "date-fns"
import { DeleteTopicDialog, TopicDialog } from "./topic-dialogs"
import Check from "./check"


export const columns: ColumnDef<TopicDAO>[] = [
  
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Name
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "prompt",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Prompt
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "enabledStr",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Activo
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
    cell: ({ row }) => {
      const data= row.original
      return (<Check id={data.id} checked={data.enabled} />)
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
},
  // {
  //   accessorKey: "role",
  //   header: ({ column }) => {
  //     return (
  //       <Button variant="ghost" className="pl-0 dark:text-white"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //         Rol
  //         <ArrowUpDown className="w-4 h-4 ml-1" />
  //       </Button>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Topic ${data.id}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <TopicDialog id={data.id} />
          <DeleteTopicDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


