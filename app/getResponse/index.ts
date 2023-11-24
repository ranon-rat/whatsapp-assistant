import {default as axios} from "axios"
import {flowiseApi} from "../types"



export async function getResponse(msgs: flowiseApi): Promise<string> {
  let url = process.env.FLOWISE_WILLIAM
/*
 The reason this exists is just for making everything work.
 With this you can send a message to the chatflow with function calling
 And also you can do it to the chatflow with your fine tuned model.

*/

  // this just get the response from your flowise host
  let res = await axios({
    "url": url,
    "headers": {
      "Authorization": "Bearer " + process.env.FLOWISE_KEY,
      "Content-Type": "application/json"
    },
    "method": "POST",
    "data": msgs
    ,
  }).then(r=>r.data).catch(e => e.response?console.log(e.response.data):null);
  if(!res?.text){
    return "error interno"
  }

  //&&

  return res.text
}
// this send a message to an specific number(from) it can use both (phone number and whatsapp id)
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
