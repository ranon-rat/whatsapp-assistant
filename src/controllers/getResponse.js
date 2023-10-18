
const axios=require("axios").default
exports.getResponse=async function getResponse(msgs) {

  let res = await axios({
    url: process.env.FLOWISE_URL,
    headers: {
      Authorization: "Bearer " + process.env.FLOWISE_KEY,
      "Content-Type": "application/json"
    },
    method: "POST",
    "data": msgs  
    ,
  }).catch(e => e.response ? console.log(e.response.data) : null);

  if (!res) {
    return "error interno"
  }
  return res.data
}
exports.sendAMessage= function sendAMessage (phone_number_id, from, response) {
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
