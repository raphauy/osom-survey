import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import getSession from "@/lib/auth"
import { HomeIcon } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { getDataClientOfUser, getDataClients } from "./admin/clients/(crud)/actions"

export default async function Home() {
  const session= await getSession()

  if (!session) return redirect("/login")

  const user= session.user

  console.log("user: ", user.email)  

  if (user.role === "cliente") {
    const client= await getDataClientOfUser(user.id)
    if (!client) return <div>Usuario sin cliente asignado</div>
    
    return redirect(`/client/${client.slug}`)
  }

  if (user.role === "admin") {
    return redirect("/admin")
  }

  return null
}
