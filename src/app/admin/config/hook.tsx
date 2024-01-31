"use client"

import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import useCopyToClipboard from "@/lib/useCopyToClipboard"
import { Copy, Edit } from "lucide-react"
import { useEffect, useState } from "react"
import { EndpointDialog } from "./(crud)/endpoint-dialog"
import { DataClient, getDataClient, updateEndpoint } from "../clients/(crud)/actions"
import { usePathname, useSearchParams } from "next/navigation"

interface Props {
    basePath: string
}

export default function Hook({ basePath }: Props) {

    const [value, copy] = useCopyToClipboard()
    const [client, setClient] = useState<DataClient>()
    const [hook, setHook] = useState(`${basePath}/api/${client?.id}/conversation`)
    const [hookPoliticIdentification, setHookPoliticIdentification] = useState(`${basePath}/api/${client?.id}/identificacionpolitica`)
    const [endPoint, setEndPoint] = useState("No configurado")
    const searchParams= useSearchParams()

    useEffect(() => {
        const clientId= searchParams.get("clientId")
        if(!clientId) return

        const client= getDataClient(clientId)
        .then((data) => {
            if (!data) return
            setClient(data)
            data.whatsAppEndpoint && setEndPoint(data.whatsAppEndpoint)
            setHook(`${basePath}/api/${data.id}/conversation`)
            setHookPoliticIdentification(`${basePath}/api/${data.id}/identificacionpolitica`)
        })

       
    }, [searchParams, basePath])
    

    function copyHookToClipboard(){   
        copy(hook)    
        toast({title: "Hook copiado" })
    }

    function copyEndPointToClipboard(){   
        copy(endPoint)    
        toast({title: "Endpoint copiado" })
    }

    function copyPoliticaIdentificationToClipboard(){
        copy(hookPoliticIdentification)
        toast({title: "Hook identificación copiado" })
    }

    const editTrigger= (<Edit size={30} className="pr-2 hover:cursor-pointer"/>)

    return (
        <div className="w-full p-4 border rounded-lg">
            <p className="text-2xl font-bold">Hooks ({client?.nombre})</p>
            <div className="flex items-end gap-4 pb-3 border-b">
                <p className="mt-5"><strong>Entrante Mensajes</strong>: {hook}</p>
                <Button variant="ghost" className="p-1 h-7"><Copy onClick={copyHookToClipboard} /></Button>
            </div>

            <div className="flex items-end gap-4 pb-3 mb-3 border-b">
                <p className="mt-5"><strong>Entrante Id. Política</strong>: {hookPoliticIdentification}</p>
                <Button variant="ghost" className="p-1 h-7"><Copy onClick={copyPoliticaIdentificationToClipboard} /></Button>
            </div>

            <div className="flex items-center gap-4 pb-3 mt-10 mb-3 border-b">
                <p><strong>Saliente</strong>: {endPoint}</p>
                <EndpointDialog update={updateEndpoint} title="Configurar WhatsApp Endpoint" trigger={editTrigger} id={client?.id || ""} />
                <Button variant="ghost" className="p-1 h-7"><Copy onClick={copyEndPointToClipboard} /></Button>
            </div>


        </div>
    )
}
