import { default as axios } from "axios"
import { flowiseApi, messagesFlowise } from "../types"



export async function getResponse(prompt: string, conversations: messagesFlowise[], tool: boolean): Promise<string> {
  let url = process.env.FLOWISE_WILLIAM
  if (tool) {
    url = process.env.FLOWISE_TOOL
  }
  // this just get the response from your flowise host
  let res = await axios({
    "url": url,
    "headers": {
      "Authorization": "Bearer " + process.env.FLOWISE_KEY,
      "Content-Type": "application/json"
    },
    "method": "POST",
    "data": {
      question: prompt,
      history: conversations,
      overrideConfig: {
        returnSourceDocuments: true
      }
    }
    ,
  }).then(r => r.data).catch(e => e.response ?
    (e.response.data.includes("tool") ?
      { text: getResponse(prompt, conversations, tool) } :
      console.log(e.response.data))
    : null);
  if (!res) {
    return "error interno"
  }
  if (!res?.text) {
    return res
  }

  //&&

  return res.text
}
// this send a message to an specific number(from) it can use both (phone number and whatsapp id)
export function sendAMessage(phone_number_id: string, from: string, response: string) {
  axios({
    method: "POST",
    url: `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
    data: {
      "messaging_product": "whatsapp",
      "recipient_type": "individual",
      "to": from,
      "type": "text",
      "text": {
        "preview_url": false,
        "body": response
      }
    },
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + process.env.WHATSAPP_TOKEN
    },
  }).catch(e => e.response ? console.log(e.response.data) : null);
}
