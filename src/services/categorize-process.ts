import { categorizeResponse } from "./category-services"
import { getValue, setValue } from "./config-services"
import { getTopicByName } from "./topic-services"
import { getNextTopicResponsesWithoutCategory, getTopicResponsesWithoutCategoryCount } from "./topicresponse-services"


export async function initCategorize() {
    // start a loop to categorize responses until status is STOPPED
    await setValue("STATUS", "RUNNING")
    console.log("status set to RUNNING")

    let sleepTimeStr= await getValue("CATEGORIZE_SLEEP_TIME")
    if (!sleepTimeStr) {
        console.log("CATEGORIZE_SLEEP_TIME not found, setting to 10 seconds")
        await setValue("CATEGORIZE_SLEEP_TIME", "10")
        sleepTimeStr= "10"
    }
    const sleepTime= parseInt(sleepTimeStr) * 1000
    console.log(`sleepTime: ${sleepTime/1000} seconds`)

    while (true) {
        const status= await getValue("STATUS")
        if (status === "STOPPED") {
            console.log("status is STOPPED, breaking loop")
            break
        }

        const nextToProcess= await getNextTopicResponsesWithoutCategory()

        if (!nextToProcess) {
            console.log(`no more responses to categorize, sleeping for ${sleepTime} milliseconds`)
            await new Promise((resolve) => setTimeout(resolve, sleepTime))
        } else {
            //console.log("status is RUNNING, categorizing response")
            await categorizeResponse(nextToProcess.id)            
        }

        

    }

    console.log("status is STOPPED, stopping loop")
}