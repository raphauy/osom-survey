"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"
import { deleteCategoryAction, createOrUpdateCategoryAction, getCategoryDAOAction } from "./category-actions"
import { categorySchema, CategoryFormValues } from '@/services/category-services'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader } from "lucide-react"
import { TopicDAO } from "@/services/topic-services"
import { getTopicsDAOAction } from "../topics/topic-actions"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type Props= {
  id?: string
  closeDialog: () => void
}

export function CategoryForm({ id, closeDialog }: Props) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {},
    mode: "onChange",
  })
  const [loading, setLoading] = useState(false)
  const [topics, setTopics] = useState<TopicDAO[]>([])
  const [topicName, setTopicName] = useState<string>("")

  const onSubmit = async (data: CategoryFormValues) => {
    setLoading(true)
    try {
      await createOrUpdateCategoryAction(id ? id : null, data)
      toast({ title: id ? "Category updated" : "Category created" })
      closeDialog()
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTopicsDAOAction()
    .then((data) => {
      if (data) {
        setTopics(data)
      }
    })
    .catch((error) => {
      toast({title: "Error", description: error.message, variant: "destructive"})
    })    

  }, [])
  

  useEffect(() => {
    if (id) {
      getCategoryDAOAction(id).then((data) => {
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
      
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea rows={7} placeholder="Descripción" {...field} />
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
                <FormLabel>Cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      {
                        id ? 
                        <SelectValue className="text-muted-foreground" placeholder={topicName} /> :
                        <SelectValue className="text-muted-foreground" placeholder="Selecciona un Tema" />
                      }
                      
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {topics.map(item => (
                      <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                    ))
                    }
                  </SelectContent>
                </Select>
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

export function DeleteCategoryForm({ id, closeDialog }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteCategoryAction(id)
    .then(() => {
      toast({title: "Category deleted" })
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

