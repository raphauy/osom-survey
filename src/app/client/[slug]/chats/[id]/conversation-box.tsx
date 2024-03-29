"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SurveyDAO } from "@/services/survey-services"
import { TopicDAO } from "@/services/topic-services"
import { TopicResponseDAO } from "@/services/topicresponse-services"
import { Message } from "ai"
import { Bot, User } from "lucide-react"
import { useRef } from "react"

type Props = {
    messages: Message[]
    responses: TopicResponseDAO[]
    topics: TopicDAO[]
    survey: SurveyDAO
}
export default function ConversationBox( { messages, responses, topics, survey }: Props ) {

    const totalTopics= topics?.length
    const topicsWithoutResponses= topics?.filter((topic) => !responses?.find((response) => response.topic.id === topic.id))
  
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="items-stretch h-full"
        >
            <ResizablePanel
            defaultSize={60}
            minSize={40}
            >

            <div className="flex flex-col items-center w-full pb-40">
                {messages.length > 0 ? (

                    messages.map((message, i) => (
                        message.role === "function" ? null :
                        <div key={i} className={cn("flex text-gray-800 w-full items-center border-b border-gray-200 py-2 px-5 mr-3",
                        message.role === "user" ? "bg-white" : "bg-gray-100")}>
                            
                        <div className="flex items-center w-full mx-5 space-x-4">
                        <div className={cn("p-1.5 text-white", message.role === "assistant" ? "bg-green-500" : "bg-black")}>
                            {message.role === "user" ? (
                            <User width={20} />
                            ) : (
                            <Bot width={20} />
                            )}
                        </div>
                        <div className="whitespace-pre-line">
                        {message.content}
                        </div>
                        </div>            
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500">
                    No hay mensajes
                    </p>
                )}
            </div>
            </ResizablePanel>
            <ResizableHandle withHandle className='border-r text-osom-color border-osom-color'/>
            <ResizablePanel
            defaultSize={40}
            minSize={30}
            className='flex flex-col items-center justify-between overflow-y-auto'
            >
            <div className='hidden w-full px-2 py-2 lg:px-3 md:block'>
            {
                survey && 
                <Card className="w-full mt-1">
                    <CardHeader>
                        <CardTitle className="text-green-700">Identificación política</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-1 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 space-y-1">
                            <span className="flex w-2 h-2 mt-0.5 translate-y-1 bg-green-700 rounded-full" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">Voto partido</p>
                                <p className="text-sm text-muted-foreground">{survey.votoPartido}</p>
                            </div>
                        </div>
                        <div className="mb-1 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 space-y-1">
                            <span className="flex w-2 h-2 mt-0.5 translate-y-1 bg-green-700 rounded-full" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">Preferencia Partido</p>
                                <p className="text-sm text-muted-foreground">{survey.preferenciaPartido}</p>
                            </div>
                        </div>
                        <div className="mb-1 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 space-y-1">
                            <span className="flex w-2 h-2 mt-0.5 translate-y-1 bg-green-700 rounded-full" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">Candidato Preferencia</p>
                                <p className="text-sm text-muted-foreground">{survey.candidatoPreferencia}</p>
                            </div>
                        </div>
                        <div className="mb-1 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 space-y-1">
                            <span className="flex w-2 h-2 mt-0.5 translate-y-1 bg-green-700 rounded-full" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">Candidato Interno Preferencia</p>
                                <p className="text-sm text-muted-foreground">{survey.candidatoInternoPreferencia}</p>
                            </div>
                        </div>
                        <div className="mb-1 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 space-y-1">
                            <span className="flex w-2 h-2 mt-0.5 translate-y-1 bg-green-700 rounded-full" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">Medios de Informacion</p>
                                <p className="text-sm text-muted-foreground">{survey.mediosInformacion}</p>
                            </div>
                        </div>
                        <div className="mb-1 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 space-y-1">
                            <span className="flex w-2 h-2 mt-0.5 translate-y-1 bg-green-700 rounded-full" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">Edad</p>
                                <p className="text-sm text-muted-foreground">{survey.edad}</p>
                            </div>
                        </div>
                        <div className="mb-1 grid grid-cols-[25px_1fr] items-start last:mb-0 last:pb-0 space-y-1">
                            <span className="flex w-2 h-2 mt-0.5 translate-y-1 bg-green-700 rounded-full" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">Departamento de Residencia</p>
                                <p className="text-sm text-muted-foreground">{survey.departamentoResidencia}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

            }

            {responses?.map((response) => (
                <Card className="w-full mt-1" key={response.id}>
                    <CardHeader>
                    <div className="flex justify-between">
                        <CardTitle>{response.topic.name}</CardTitle>
                        <p className="text-osom-color">{response.categoryName}</p>
                    </div>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-1 grid grid-cols-[25px_1fr] items-start pb-3 last:mb-0 last:pb-0 space-y-1">
                        <span className="flex w-2 h-2 mt-0.5 translate-y-1 rounded-full bg-osom-color" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Planteo del problema</p>
                            <p className="text-sm text-muted-foreground">{response.respuestaPlanteo}</p>
                        </div>
                        <span className="flex w-2 h-2 translate-y-1 rounded-full bg-osom-color" />
                        <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">Posible solución</p>
                            <p className="text-sm text-muted-foreground">{response.respuestaSolucion}</p>
                        </div>
                        </div>
                        <p>Gravedad según IA: {response.gravedad}/10</p>
                        <Progress value={response.gravedad*10} className="h-2 mt-2" />
                    </CardContent>
                </Card>
            ))
            }
            {topicsWithoutResponses?.map((topic) => (
                <Card className='w-full mt-1' key={topic.id}>
                <CardHeader>
                    <CardTitle className='text-muted-foreground'>{topic.name}</CardTitle>
                </CardHeader>
                </Card>
                ))
            }

        </div>
        <div className='w-full p-2'>
            <Separator/>
            <p>{responses?.length === 0 ? "No hay respuestas" : responses?.length === 1 ? `1 respuesta de ${totalTopics} temas` : `${responses?.length} respuestas de ${totalTopics} temas`}</p>
        </div>
        </ResizablePanel>
        </ResizablePanelGroup>
    )
}
