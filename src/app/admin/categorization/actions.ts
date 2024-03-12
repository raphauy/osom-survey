"use server"

import { initCategorize } from "@/services/categorize-process"
import { getValue, setValue } from "@/services/config-services"
import { revalidatePath } from "next/cache"

export async function getCategorizationStatusAction() {
    
    const STATUS= await getValue("STATUS")
    if (!STATUS) {
        console.log("STATUS is not set in config database")
        return "NOT_SET"
    }
  
    return STATUS
}

export async function setCategorizationStatusAction(status: "STOPPED" | "RUNNING") {
    const res= await setValue("STATUS", status)
    if (!res) {
        console.error("Error setting status")
        return false
    }

    revalidatePath("/admin/categorization")

    return true
}

export async function initCategorizationAction() {

    // const apiToken= process.env.API_TOKEN
    // if (!apiToken) {
    //     console.error("API_TOKEN is not defined")
    //     throw new Error("API_TOKEN is not defined")
    // }
    // const baseUrl= process.env.NEXTAUTH_URL
    // const url= `${baseUrl}/api/categorization`
    // const res= await fetch(url, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json",
    //         "Authorization": "Bearer " + apiToken
    //     },
    //     body: JSON.stringify({"init": true})
    // })

    initCategorize()

    return true
}