"use client"

import { Button } from "@/components/ui/button"
import { TopicResponseDAO } from "@/services/topicresponse-services"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Layers } from "lucide-react"
import { format } from "date-fns"
import { DeleteTopicResponseDialog, TopicResponseDialog } from "./topicresponse-dialogs"
import CategorizeButton from "./categorize-button"


export const columns: ColumnDef<TopicResponseDAO>[] = [
  
  {
    accessorKey: "phone",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Phone
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },
  {
    accessorKey: "topicName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tema
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},    
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "categoryName",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Categoría
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},    
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "respuestaPlanteo",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            RespuestaPlanteo
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },

  {
    accessorKey: "respuestaSolucion",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            RespuestaSolucion
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },
  {
    accessorKey: "gravedad",
    header: ({ column }) => {
        return (
          <Button variant="ghost" className="pl-0 dark:text-white"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Gravedad
            <ArrowUpDown className="w-4 h-4 ml-1" />
          </Button>
    )},
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Quieres eliminar las respuestas sobre ${data.topicName} de ${data.phone}? (${data.id})`
 
      return (
        <div className="flex items-center justify-end gap-2">

          {/* <TopicResponseDialog id={data.id} /> */}
          <CategorizeButton topicResponseId={data.id} />
          <DeleteTopicResponseDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


