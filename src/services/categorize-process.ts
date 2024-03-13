import { categorizeResponse } from "./category-services"
import { getValue, setValue } from "./config-services"
import { getTopicByName } from "./topic-services"
import { getNextTopicResponsesWithoutCategory, getTopicResponsesWithoutCategoryCount } from "./topicresponse-services"


export async function initCategorize() {
    // start a loop to categorize responses until status is STOPPED
    await setValue("STATUS", "RUNNING")
    console.log("status set to RUNNING")

    while (true) {
        const status= await getValue("STATUS")
        if (status === "STOPPED") {
            console.log("status is STOPPED, breaking loop")
            break
        }

        const nextToProcess= await getNextTopicResponsesWithoutCategory()

        if (!nextToProcess) {
            console.log("no more responses to categorize, sleeping for 5 seconds")
            await new Promise((resolve) => setTimeout(resolve, 5000))
        } else {
            console.log("status is RUNNING, categorizing response")
            await categorizeResponse(nextToProcess.id)            
        }

        

    }

    console.log("status is STOPPED, stopping loop")
}