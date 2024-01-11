"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteTopicResponseAction, createOrUpdateTopicResponseAction, getTopicResponseDAOAction } from "./topicresponse-actions"
import { topicResponseSchema, TopicResponseFormValues } from '@/services/topicresponse-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"

type Props= {
  id?: string
  closeDialog: () => void
}

export function TopicResponseForm({ id, closeDialog }: Props) {
  const form = useForm<TopicResponseFormValues>({
    resolver: zodResolver(topicResponseSchema),
    defaultValues: {},
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: TopicResponseFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateTopicResponseAction(id ? id : null, data)
      toast({ title: id ? "TopicResponse updated" : "TopicResponse created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      getTopicResponseDAOAction(id).then((data) => {
        if (data) {
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
            name="respuestaPlanteo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RespuestaPlanteo</FormLabel>
                <FormControl>
                  <Input placeholder="TopicResponse's respuestaPlanteo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="respuestaSolucion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RespuestaSolucion</FormLabel>
                <FormControl>
                  <Input placeholder="TopicResponse's respuestaSolucion" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="topicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TopicId</FormLabel>
                <FormControl>
                  <Input placeholder="TopicResponse's topicId" {...field} />
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

type DeleteProps= {
  id?: string
  closeDialog: () => void
  notifyDelete?: () => void
}

export function DeleteTopicResponseForm({ id, closeDialog, notifyDelete }: DeleteProps) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteTopicResponseAction(id)
    .then(() => {
      toast({title: "Respuesta eliminada"})
      notifyDelete && notifyDelete()
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

