'use client'
 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { TopicDAO } from '@/services/topic-services'
import { useChat } from 'ai/react'
import clsx from 'clsx'
import { Bot, Cog, Loader, SendIcon, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Textarea from "react-textarea-autosize"
import remarkGfm from "remark-gfm"
import { getTopicResponsesDAOByPhoneAction } from '../topicresponses/topicresponse-actions'
import { DeleteTopicResponseDialog } from '../topicresponses/topicresponse-dialogs'
import { getEnabledTopicsDAOBySlugAction } from '../topics/topic-actions'
import { Message } from 'ai'
import { getActiveMessagesAction } from './actions'

const RAFFO_SLUG = "raffo"

export default function SimulatorPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, input, isLoading, handleSubmit, setInput, setMessages } = useChat({onFinish: onFinished})
  const session = useSession()
  const [mail, setMail] = useState("")
  const [responses, setResponses] = useState<any[]>()
  const [topics, setTopics] = useState<TopicDAO[] | null>()
  const [totalTopics, setTotalTopics] = useState(0)
  const [counter, setCounter] = useState(0)
  const [newResponse, setNewResponse] = useState(false)

  function onFinished(message: Message) {
    setCounter(counter+1)  
  }

  useEffect(() => {
    const email= session?.data?.user?.email
    console.log("updating messages")
    
    if (email) {
      getActiveMessagesAction(email)
      .then((res) => {
        if(!res) return
        // @ts-ignore
        setMessages(res)
      })
      .catch((err) => {
        console.log(err)
      })
    }
    }, [session, setMessages, counter])

  useEffect(() => {
    if (session?.data?.user?.email) {
      setMail(session.data.user.email)
      getTopicResponsesDAOByPhoneAction(session.data.user.email)
      .then((res) => {
        setResponses(res)
        if (res.length !== responses?.length && counter > 0) {
          setNewResponse(true)
          toast({ title: "Nueva respuesta 👆🏼"})
          setTimeout(() => {
            setNewResponse(false)
          }, 5000)
        }
      })
    }
  }, [session, counter, responses])
  
  useEffect(() => {
    getEnabledTopicsDAOBySlugAction(RAFFO_SLUG)
    .then((res) => {
      if(!res) return
      setTotalTopics(res.length)
      const topicsWithoutResponses = res.filter((topic) => !responses?.some((response) => response.topic.id === topic.id))
      setTopics(topicsWithoutResponses)
    })
    .catch((err) => {
      console.log(err)
    })
  }, [responses])
  
 
  const disabled = isLoading || input.length === 0;

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
            // skip functioni messages
            message.role === "function" ? null :
            <div key={i} className={clsx("flex text-gray-800 w-full items-center border-b border-gray-200 py-2 px-5 mr-3",
                message.role === "user" ? "bg-white" : message.role === "assistant" ? "bg-gray-100" : "bg-green-100",
              )}
            >
              <div className="flex items-center w-full mx-5 space-x-4">
                <div
                  className={clsx(
                    "p-1.5 text-white",
                    message.role === "assistant" ? "bg-green-500" : "bg-black",
                  )}
                >
                  {message.role === "user" ? (
                    <User width={20} />
                  ) : 
                    <Bot width={20} />
                }
                </div>
                <div>                  
                {message.content}
                </div>
              </div>            
            </div>
          ))
        ) : (
          <div className="max-w-screen-md mx-2 mt-3 border border-gray-200 rounded-md lg:mx-3 w-fit">
            <div className="flex flex-col space-y-4 p-7 sm:p-10">
              <h1 className="text-lg font-semibold text-black">
                Bienvenido al simulador de encuestas de Osom
              </h1>
              <p className="text-gray-500">
                Encuestas sobre problemáticas en los barrios para campaña de Laura Raffo
              </p>
            </div>
          </div>
        )}

        <div className="fixed bottom-0 flex flex-col items-center w-full gap-3 px-16 pb-3 md:px-6 lg:px-10 md:w-2/5">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="relative w-full px-4 pt-4 pb-3 bg-white border border-gray-200 shadow-lg rounded-xl"
          >
            <Textarea
              ref={inputRef}
              tabIndex={0}
              required
              rows={1}
              autoFocus
              placeholder="Escribir mensaje"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  formRef.current?.requestSubmit();
                  e.preventDefault();
                }
              }}
              spellCheck={false}
              className="w-full pr-10 focus:outline-none"
              disabled={isLoading}
            />
            <button
              className={clsx(
                "absolute inset-y-0 right-4 my-auto flex h-8 w-8 items-center justify-center rounded-md transition-all",
                disabled
                  ? "cursor-not-allowed bg-white"
                  : "bg-green-500 hover:bg-green-600",
              )}
              disabled={disabled}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <SendIcon
                  className={clsx(
                    "h-4 w-4",
                    input.length === 0 ? "text-gray-300" : "text-white",
                  )}
                />
              )}
            </button>
          </form>
        
          <p className="text-xs text-center text-gray-400">
            Creado por {" "}
            <a
              href="https://www.osomdigital.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-black"
            >            
              Osom Digital
            </a>
          </p>
        </div>
      </div>
      </ResizablePanel>
      <ResizableHandle withHandle className='border-r text-osom-color border-osom-color'/>
      <ResizablePanel
        defaultSize={40}
        minSize={30}
        className='flex flex-col items-center justify-between overflow-y-auto'
      >
      <div className='hidden w-full px-2 py-2 lg:px-3 md:block'>
        {responses?.map((response) => (
          <Card className={cn('w-full mt-1', newResponse && response.id === responses[responses.length-1].id && "bg-green-200")} key={response.id}>
            <div className='flex items-center justify-between pr-2'>
              <CardHeader>
                <CardTitle>{response.topic.name}</CardTitle>
              </CardHeader>
              <DeleteTopicResponseDialog
                id={response.id} 
                description={`Quieres eliminar las respuestas sobre ${response.topicName} de ${response.phone}? Además tenemos que reiniciar el contexto.`}
                notifyDelete={() => window.location.reload()}
              />
            </div>
            <CardContent>
              <div className="mb-1 grid grid-cols-[25px_1fr] items-start pb-3 last:mb-0 last:pb-0 space-y-1">
                <span className="flex w-2 h-2 translate-y-1 rounded-full bg-osom-color" />
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
        {topics?.map((topic) => (
          <Card className='w-full mt-1' key={topic.id}>
            <CardHeader>
              <CardTitle className='text-muted-foreground'>{topic.name}</CardTitle>
            </CardHeader>
          </Card>
          ))
        }

     </div>
     <div className='w-full p-2'>
      <Separator className='my-2'/>
      <p>{responses?.length === 0 ? "No hay respuestas" : responses?.length === 1 ? `1 respuesta de ${totalTopics} temas` : `${responses?.length} respuestas de ${totalTopics} temas`}</p>
     </div>
     </ResizablePanel>
    </ResizablePanelGroup>
  );
}