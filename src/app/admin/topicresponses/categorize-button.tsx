"use client"

import { Layers } from "lucide-react"
import { categorizeResponseAction } from "./topicresponse-actions"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"

type Props= {
    topicResponseId: string
}

export default function CategorizeButton({ topicResponseId }: Props) {
    const [loading, setLoading] = useState(false)

    function categorizeResponse(topicResponseId: string) {
        setLoading(true)
        categorizeResponseAction(topicResponseId)
        .then(() => {
            toast({title: "Respuesta categorizada"})
        })
        .catch((error) => {
            console.error("Error categorizing response", error)
        })
        .finally(() => {
            setLoading(false)
        })        
    }
    return (
        <div>
            <Button variant="ghost" onClick={() => categorizeResponse(topicResponseId)}>
                {loading ? <Layers size={20} className="animate-spin" /> : <Layers size={20} />}
            </Button>
        </div>
    )
}
