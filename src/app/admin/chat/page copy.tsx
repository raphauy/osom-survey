'use client'
 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TopicResponseDAO } from '@/services/topicresponse-services';
import { useChat } from 'ai/react';
import clsx from 'clsx';
import { Bot, Loader, SendIcon, User } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Textarea from "react-textarea-autosize";
import remarkGfm from "remark-gfm";
import { getTopicResponsesDAOByPhoneAction } from '../topicresponses/topicresponse-actions';
 
export default function SloganGenerator() {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, input, isLoading, handleInputChange, handleSubmit, setInput } = useChat()
  const session = useSession()
  const [mail, setMail] = useState("")
  const [responses, setResponses] = useState<TopicResponseDAO[]>()

  useEffect(() => {
    if (session?.data?.user?.email) {
      setMail(session.data.user.email)
      getTopicResponsesDAOByPhoneAction(session.data.user.email)
      .then((res) => {
        setResponses(res)
      })
    }
  }, [session])
  
 
  const disabled = isLoading || input.length === 0;

  return (
    <main className='grid w-full h-full grid-cols-1 px-1 md:grid-cols-2'>
      <div className="flex flex-col items-center w-full pb-40">
        {messages.length > 0 ? (
          messages.map((message, i) => (
            <div
              key={i}
              className={clsx(
                "flex w-full items-center justify-center border-b border-gray-200 py-8",
                message.role === "user" ? "bg-white" : "bg-gray-100",
              )}
            >
              <div className="flex items-start w-full max-w-screen-md px-5 space-x-4 sm:px-0">
                <div
                  className={clsx(
                    "p-1.5 text-white",
                    message.role === "assistant" ? "bg-green-500" : "bg-black",
                  )}
                >
                  {message.role === "user" ? (
                    <User width={20} />
                  ) : (
                    <Bot width={20} />
                  )}
                </div>
                <ReactMarkdown
                  className="w-full mt-1 prose break-words prose-p:leading-relaxed"
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: (props) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>            
            </div>
          ))
        ) : (
          <div className="max-w-screen-md mx-5 mt-20 border rounded-md border-gray-200sm:mx-0 sm:w-full">
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

        <div className="fixed bottom-0 flex flex-col items-center w-full gap-3 px-16 pb-3 md:px-6 lg:px-10 md:w-1/2">
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
      <div className='hidden py-1 pl-2 ml-2 border-l lg:pl-3 md:block border-osom-color'>
        {mail}<br/>
        {responses?.length === 0 ? "No hay respuestas" : responses?.length === 1 ? "Hay 1 respuesta" : `Hay ${responses?.length} respuestas`}
        {responses?.map((response) => (
          <Card className='w-full mt-1' key={response.id}>
            <CardHeader>
              <CardTitle>{response.topic.name}</CardTitle>
            </CardHeader>
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
     </div>
    </main>
  );
}