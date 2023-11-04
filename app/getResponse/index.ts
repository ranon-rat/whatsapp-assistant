import {default as axios} from "axios"
import {flowiseApi} from "@/app/types"



export async function getResponse(msgs: flowiseApi, kind: string = "TOOL"): Promise<string> {
  let url = process.env.FLOWISE_URL_TOOL
  if (kind == "WILLIAM") {
    url = process.env.FLOWISE_URL_WILLIAM
  }
  let res = await axios({
    "url": url,
    "headers": {
      "Authorization": "Bearer " + process.env.FLOWISE_KEY,
      "Content-Type": "application/json"
    },
    "method": "POST",
    "data": msgs
    ,
  }).catch(e => e.response ? console.log(e.response.data) : null);

  if (!res) {
    return "error interno"
  }
  return res.data
}

export function sendAMessage (phone_number_id:string, from:string, response:string) {
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
