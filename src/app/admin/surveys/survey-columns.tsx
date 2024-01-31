"use client"

import { SurveyDAO } from "@/services/survey-services"
import { ColumnDef } from "@tanstack/react-table"
import { DeleteSurveyDialog, SurveyDialog } from "./survey-dialogs"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"


export const columns: ColumnDef<SurveyDAO>[] = [
  
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
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Phone
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },    
  },
  {
    accessorKey: "edad",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Edad
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },    
  },
  {
    accessorKey: "departamentoResidencia",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Departamento
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },    
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
},
  {
    accessorKey: "votoPartido",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Voto Partido
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },    
		cell: ({ row }) => {
      const data= row.original
      return (
        <div className="flex flex-col">
          <p>{data.votoPartido}</p>
          <p>{data.preferenciaPartido}</p>
        </div>

      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "candidatoInternoPreferencia",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Candidato Interno
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },    
  },
  {
    accessorKey: "mediosInformacion",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Medios
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },    
  },
  {
    accessorKey: "conversationsCount",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="pl-0 dark:text-white"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          #
          <ArrowUpDown className="w-4 h-4 ml-1" />
        </Button>
      )
    },    
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data= row.original

      const deleteDescription= `Do you want to delete Survey for ${data.phone}?`
 
      return (
        <div className="flex items-center justify-end gap-2">

          <SurveyDialog id={data.id} />
          <DeleteSurveyDialog description={deleteDescription} id={data.id} />
        </div>

      )
    },
  },
]


