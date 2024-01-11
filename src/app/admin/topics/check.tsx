"use client"

import { Switch } from "@/components/ui/switch"
import { toggleTopicEnabledAction } from "./topic-actions"
import { useState } from "react"
import { Loader } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

type Props = {
    id: string
    checked: boolean
}

export default function Check({ id, checked }: Props) {
    const [loading, setLoading] = useState(false)

    function handleSwitch() {
        setLoading(true)
        toggleTopicEnabledAction(id)
        .then(() => {
            if (checked) {
                toast({ title: "Tema deshabilitado" })
            } else {
                toast({ title: "Tema habilitado" })
            }            
        })
        .catch((error) => {
            toast({ title: "Error", description: error.message, variant: "destructive" })
        })
        .finally(() => {
            setLoading(false)
        })
    }
    return (
        <div className="flex">
            <Switch checked={checked} onCheckedChange={handleSwitch} />
            {loading && <Loader className="w-6 h-6 animate-spin" />}
        </div>
    )
}
