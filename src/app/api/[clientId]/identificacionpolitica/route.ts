import { messageArrived, processMessage } from "@/services/conversationService";
import { MessageDelayResponse, onMessageReceived, processDelayedMessage } from "@/services/messageDelayService";
import { SurveyFormValues, createOrUpdateSurvey } from "@/services/survey-services";
import { NextResponse } from "next/server";


export async function POST(request: Request, { params }: { params: { clientId: string } }) {

    try {
        const authorization = request.headers.get("authorization")
        if (!authorization) return NextResponse.json({ error: "authorization is required" }, { status: 400 })
        const apiToken= authorization.replace("Bearer ", "")
        if (!apiToken) return NextResponse.json({ error: "apiToken is required" }, { status: 400 })
        if (apiToken !== process.env.API_TOKEN) return NextResponse.json({ error: "Bad apiToken" }, { status: 400 })
        
        const clientId = params.clientId
        if (!clientId) return NextResponse.json({ error: "clientId is required" }, { status: 400 })

        const json= await request.json()
        const message= json.message
        console.log("json: ", json)
        console.log("message: ", message)

        const phone = message.phone
        if (!phone) {
            return NextResponse.json({ error: "phone is required" }, { status: 400 })
        }
        console.log("phone: ", phone)

        const encuesta= message.encuesta
        if (!encuesta) {
            return NextResponse.json({ error: "encuesta is required" }, { status: 400 })
        }
        console.log("encuesta: ", encuesta)

        const surveyFormData: SurveyFormValues = {
            phone: phone,
            votoPartido: encuesta.pregunta_1.voto_partido,
            preferenciaPartido: encuesta.pregunta_2.preferencia_partido,
            candidatoPreferencia: encuesta.pregunta_3.candidato_preferencia,
            candidatoInternoPreferencia: encuesta.pregunta_4.candidato_interno_preferencia,
            mediosInformacion: encuesta.pregunta_5.medios_informacion,
            edad: encuesta.pregunta_6.edad,
            departamentoResidencia: encuesta.pregunta_7.departamento_residencia,
        }

        const updated= await createOrUpdateSurvey(surveyFormData)
        if (!updated) {
            return NextResponse.json({ error: "error creating survey" }, { status: 502 })
        }

        return NextResponse.json({ data: "ACK" }, { status: 200 })

    } catch (error) {
        return NextResponse.json({ error: "error: " + error}, { status: 502 })        
    }
   
}

