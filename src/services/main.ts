import { categorizeResponse } from "./category-services"

async function main() {

    const topicResponseId = 'cls9813xf005m7vvxexbu49zs'

    //await categorizeResponse(topicResponseId)

    const apiToken= process.env.API_TOKEN
    if (!apiToken) {
        console.error("API_TOKEN is not defined")
        throw new Error("API_TOKEN is not defined")
    }
    const baseUrl= process.env.NEXTAUTH_URL
    const url= `${baseUrl}/api/categorization`
    console.log("url: ", url)
    
    // apiToken is Bearer token
    const res= await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + apiToken
        },
        body: JSON.stringify({"init": true})
    })

    console.log("res: ", res)


}
  
main()
  