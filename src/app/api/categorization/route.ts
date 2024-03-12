import { getValue, setValue } from "@/services/config-services"
import { NextResponse } from "next/server"

 

export async function POST(request: Request) {

  const authorization = request.headers.get("authorization")
  if (!authorization) return NextResponse.json({ error: "authorization is required" }, { status: 400 })
  const apiToken= authorization.replace("Bearer ", "")
  if (!apiToken) return NextResponse.json({ error: "apiToken is required" }, { status: 400 })
  if (apiToken !== process.env.API_TOKEN) return NextResponse.json({ error: "Bad apiToken" }, { status: 400 })

  const json= await request.json()
  console.log("json: ", json)

  const status= await getValue("STATUS")
  if (status === "RUNNING") {
    console.log("status is RUNNING, doing nothing")
    return NextResponse.json({ data: "ACK" }, { status: 200 })
  } else {
    console.log("setting status to RUNNING")
    const res= await setValue("STATUS", "RUNNING")
    if (!res) {
      console.error("Error setting status")
      return NextResponse.json({ error: "Error setting status" }, { status: 500 })
    } else {
      // todo start categorizing responses
    }
  }

  return NextResponse.json({ data: "ACK" }, { status: 200 })

}