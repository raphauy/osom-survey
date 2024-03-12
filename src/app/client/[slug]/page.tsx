import { getDataClientBySlug } from "@/app/admin/clients/(crud)/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getClientBySlug } from "@/services/clientService"
import { getUsersOfClient } from "@/services/userService"
import { HomeIcon, MessageCircle, User } from "lucide-react"
import Link from "next/link"
import { getDataConversations, getTotalMessages } from "./chats/actions"
import { getConversationsCount, getMessagesCount } from "@/services/conversationService"

interface Props{
  params: {
    slug: string
  },
}

type DataRole = {
  role: string,
  count: number
}

type TipoCant = {
  tipo: string | null,
  cant: number
}
export default async function ClientPage({ params: { slug } }: Props) {

  const client= await getClientBySlug(slug)
  if (!client) return <div>Cliente no encontrado</div>

  const users= await getUsersOfClient(client?.id)

  const conversationsCount= await getConversationsCount(client.id)
  const messagesCount= await getMessagesCount(client.id)


  return (
    <div className="flex flex-col">
      <p className="mt-10 mb-5 text-3xl font-bold text-center">{client.name}</p>
      <div className="grid grid-cols-1 gap-3 p-2 md:grid-cols-2">

        <div className="flex flex-col items-center">
          <Link href={`/client/${slug}/chats`}>
            <Card className="w-64">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Conversaciones</CardTitle>
                <MessageCircle className="text-gray-500" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{conversationsCount}</div>
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">
                    {messagesCount === 0 ? 'no hay mensajes' : `${messagesCount} mensajes`}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="flex flex-col items-center">
          <Link href={`/client/${slug}/users`}>
            <Card className="w-64">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                <User className="text-gray-500" size={20} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{client?.users.length}</div>
                <div className="flex justify-between">
                  {
                    users.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        no hay usuarios
                      </p>
                    )                  
                  }
                  <p className="text-xs text-muted-foreground">
                    { users.length + " usuarios con rol cliente" }
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
