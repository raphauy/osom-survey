import { getCurrentUser } from "@/lib/auth"
import { getConversation } from "@/services/conversationService"
import { getTopicsDAO } from "@/services/topic-services"
import { getActiveTopicResponsesDAOByConversationId } from "@/services/topicresponse-services"
import { format } from "date-fns"
import { utcToZonedTime } from "date-fns-tz"
import ConversationBox from "./conversation-box"
import { getSurveyDAOByPhone } from "@/services/survey-services"
import { DeleteConversationDialog } from "./delete-dialogs"

interface Props {
    params: {
      id: string
    }
  }
  
export default async function ChatPage({ params: { id } }: Props) {

    const conversation= await getConversation(id)
    if (!conversation) return <div>Chat no encontrado</div>

    const fecha= utcToZonedTime(conversation.createdAt, 'America/Montevideo')
    let fechaStr= ""
    const today= utcToZonedTime(new Date(), 'America/Montevideo')
    if (fecha.getDate() === today.getDate() && fecha.getMonth() === today.getMonth() && fecha.getFullYear() === today.getFullYear()) {
      fechaStr= format(fecha, "HH:mm")
    } else {
      fechaStr= format(fecha, "yyyy/MM/dd")
    }

    const messages= conversation.messages
    const topicResponses= await getActiveTopicResponsesDAOByConversationId(conversation.id)

    const topics= await getTopicsDAO()

    const survey= await getSurveyDAOByPhone(conversation.phone)

    return (
        <main className="flex flex-col items-center justify-between w-full p-3 border-l">
          <div className="flex items-center justify-between w-full pb-2 text-center border-b">
            <p></p>
            <p className="text-lg font-bold">{conversation.phone} ({fechaStr})</p>
            <DeleteConversationDialog id={conversation.id} description={`Seguro que desea eliminar la conversación de ${conversation.phone}`} />
          </div>

          {/** @ts-ignore */}
          <ConversationBox messages={messages} topics={topics} responses={topicResponses} survey={survey} />

      
        </main>
      );
    }
    