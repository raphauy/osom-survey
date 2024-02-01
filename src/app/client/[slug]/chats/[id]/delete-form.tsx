"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"
import { useState } from "react"
import { deleteConversationAction } from "./actions"
import { useRouter } from "next/navigation"


type DeleteProps= {
  id?: string
  closeDialog: () => void
}

export function DeleteConversationForm({ id, closeDialog }: DeleteProps) {
  const [loading, setLoading] = useState(false)
  const router= useRouter()

  async function handleDelete() {
    if (!id) return
    setLoading(true)
    deleteConversationAction(id)
    .then(() => {
      toast({title: "Conversación eliminada"})
      router.push("/client/raffo/chats")
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

