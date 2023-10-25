import { NextResponse as res, NextRequest } from "next/server"
//
import { messagesFlowise, limitConversation } from "@/app/types"
//
import { getResponse, sendAMessage } from "@/app/getResponse"
import { AddConversation, GetConversations } from "@/app/database"
////
let conversations = new Map<string, messagesFlowise[]>()
let msgsFrom = new Map<string, string[]>()
export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams
    console.log(query)
    let mode = query.get("hub.mode")||"";
    let token = query.get("hub.verify_token")||"";
    console.log(token)
    //  let challenge = query.get("hub.challenge");
    if (!mode && !token) return res.json(
        { message: "something is weird" }
        , { status: 403 }) // i check if they are defined
    // i check if both of the requisites are fulfilled
    if (mode !== "subscribe" && token !== process.env.VERIFY_TOKEN) {
        return res.json(
            { message: "something is weird" }
            , { status: 403 })
    }
    // in the case that everything is fine then i will return that is completely okay
    console.log("WEBHOOK_VERIFIED");
    return res.json(
        { message: "everything is fine" }
        , { status: 200 })
}
export async function POST(req: NextRequest) {
    let body: any = await req.json()
    // i check if the object is defined
    if (body?.object) {
        return res.json(
            { message: "something is weird" }
            , { status: 404 })
    }
    let entry = body?.entry
    if (entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text === undefined) {
        return res.json(
            { message: "something is weird" }
            , { status: 404 })
    }
    //------------------------------//
    let value = entry[0].changes[0].value
    //whatsapp info that i need to check
    let phone_number_id: string = value.metadata.phone_number_id;// this is the id of the bot
    let from: string = value.messages[0].from;// whatsapp id faggoty shit
    let msg: string = value.messages[0].text.body;
    //------------------------------//

    if (process.env.DEV == "DEV") from = from.slice(0, 2) + from.slice(3, from.length) // this get me the client number
    // check if the number exists in the conversation history
    if (!conversations.get("from")) {
        conversations.set(from, await GetConversations(from))

    }
    // this will mantain a certain order in the conversation
    if (!msgsFrom.get(from)) {
        msgsFrom.set(from, [])
    }
    msgsFrom.get(from)!.push(msg)
    // if you want to have some logs
    console.log("------------------------------")
    console.log("content:", msg)
    console.log("whatsapp id:", value.messages[0].from)
    console.log("from:", from)
    console.log("processing:", msgsFrom.get(from)!.length)
    console.log("------------------------------")

    // this little promise is just checking that is our turn to send a message
    await new Promise<void>((resolve) => {
        let interval = setInterval(() => {
            if (msgsFrom.get(from)![0] != msg) {
                return
            }
            clearInterval(interval)
        }, 100)
        resolve()
    })
    //--------------------------------------

    let response = await getResponse({
        "question": "whatsappID: " + from + ";prompt: " + msg,
        "history": conversations.get(from)!,
        "overrideConfig": {
            "returnSourceDocuments": true
        }
    })

    //--------------------------------------
    //things that will keep this working

    conversations.set(from, conversations.get(from)!.concat([{
        type: "userMessage",
        message: msg
    }, {
        type: "apiMessage",
        message: response
    }]))//we need context
    msgsFrom.get(from)!.shift()//we need to mantain the order
    await AddConversation(from, msg, response)//and we need to save this to the db
    sendAMessage(phone_number_id, from, response)  //send msg
    if (conversations.get.length > limitConversation) {// this will avoid overflowing the api

        conversations.set(from, conversations.get(from)!.slice(conversations.get(from)!.length - limitConversation))

    }
    return res.json(
        { message: "everything is fine" }
        , { status: 200 })
}
