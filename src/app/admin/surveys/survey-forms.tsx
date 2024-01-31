"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteSurveyAction, createOrUpdateSurveyAction, getSurveyDAOAction } from "./survey-actions"
import { surveySchema, SurveyFormValues } from '@/services/survey-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"

type Props= {
  id?: string
  closeDialog: () => void
}

export function SurveyForm({ id, closeDialog }: Props) {
  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(surveySchema),
    defaultValues: {},
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: SurveyFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateSurveyAction(data)
      toast({ title: id ? "Survey updated" : "Survey created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getSurveyDAOAction(id).then((data) => {
        if (data) {
          // @ts-ignore
          form.reset(data)
        }
        Object.keys(form.getValues()).forEach((key: any) => {
          if (form.getValues(key) === null) {
            form.setValue(key, "")
          }
        })
      })
    }
  }, [form, id])

  return (
    <div className="p-4 bg-white rounded-md">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Survey's phone" {...field} disabled={id ? true : false} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="votoPartido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VotoPartido</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="preferenciaPartido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PreferenciaPartido</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="candidatoPreferencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CandidatoPreferencia</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="candidatoInternoPreferencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CandidatoInternoPreferencia</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="mediosInformacion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>MediosInformacion</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="edad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Edad</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="departamentoResidencia"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DepartamentoResidencia</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          

        <div className="flex justify-end">
            <Button onClick={() => closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
            <Button type="submit" className="w-32 ml-2">
              {loading ? <Loader className="w-4 h-4 animate-spin" /> : <p>Save</p>}
            </Button>
          </div>
        </form>
      </Form>
    </div>     
  )
}

export function DeleteSurveyForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteSurveyAction(id)
    .then(() => {
      toast({title: "Survey deleted" })
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })
    .finally(() => {
      setLoading(false)
      closeDialog && closeDialog()
    })
  }
  
  return (
    <div>
      <Button onClick={() => closeDialog && closeDialog()} type="button" variant={"secondary"} className="w-32">Cancel</Button>
      <Button onClick={handleDelete} variant="destructive" className="w-32 gap-1 ml-2">
        { loading && <Loader className="w-4 h-4 animate-spin" /> }
        Delete  
      </Button>
    </div>
  )
}

