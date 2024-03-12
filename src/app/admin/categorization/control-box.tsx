"use client"

import { use, useEffect, useState } from "react"
import { getCategorizationStatusAction, initCategorizationAction, setCategorizationStatusAction } from "./actions"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export default function ControlBox() {

    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState("actualizando...")

    const [refresh, setRefresh] = useState(false)

    const router= useRouter()

    useEffect(() => {
        getCategorizationStatusAction()
        .then((status) => {
            setStatus(status)
        })
        .catch((error) => {
            console.error("Error getting categorization status", error)
        })
    }, [status])

    // if refresh is true, refresh the page every 1 second until it's false
    useEffect(() => {
        if (refresh) {
            const interval= setInterval(() => {
                console.log("refreshing")                
                router.refresh()
            }, 1000)

            return () => {
                clearInterval(interval)
            }
        }
    }, [refresh, router])

    function toggleSwitch() {
        setLoading(true)

        if (status === "RUNNING") {
            setCategorizationStatusAction("STOPPED")
            .then((res) => {
                if (res) {
                    setStatus("STOPPED")
                    toast({title: `Estado cambiado a STOPPED`})
                }
            })
            .catch((error) => {
                console.error("Error setting categorization status", error)
            })
            .finally(() => {
                setLoading(false)
                setRefresh(false)
            })
        } else {
            console.log("initCategorizationAction")            
            initCategorizationAction()
            .then((res) => {
                if (res) {                    
                    toast({title: `Inicio de categorización solicitado`})
                    // chequear el estado cada 1 segundos hasta que esté RUNNING
                    const interval= setInterval(() => {
                        console.log("checking status")                        
                        getCategorizationStatusAction()
                        .then((status) => {
                            console.log("status: ", status)                            
                            setStatus(status)
                            if (status === "RUNNING") {
                                setLoading(false)
                                toast({title: `Estado cambiado a RUNNING`})
                                clearInterval(interval)
                            }
                        })
                        .catch((error) => {
                            console.error("Error getting categorization status", error)
                        })
                    }, 1000)
                }
            })
        }
    }
    
    // status STOPPED, RUNNING, NOT_SET
    return (
        <div className="p-3 border rounded-lg">
            <div className="flex justify-between">
                <div className="flex">
                    <p>Estado:</p>
                    <div className="flex items-center gap-2 ml-2">
                        {status} 
                        <Loader className={cn("animate-spin", status !== "RUNNING" && "hidden")} />
                    </div>
                </div>
                <div className="flex justify-center w-11">
                {
                    loading ? <Loader className="animate-spin" /> : <Switch checked={status === "RUNNING"} onCheckedChange={toggleSwitch} />
                }
                </div>

            </div>
            <div className="flex justify-between mt-10">
                <div className="flex items-center gap-2">
                    {refresh ? "Refreshing..." : "Refresh:"} 
                    <Loader className={cn("animate-spin", !refresh && "hidden")} />
                </div>
                <Switch checked={refresh} onCheckedChange={setRefresh} />
            </div>
        </div>
    )
}
