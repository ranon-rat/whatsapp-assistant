const axios = require("axios").default

exports.getResponse= async  (msgs)=> {
    let res = await axios({
        url: "https://api.fireworks.ai/inference/v1/chat/completions",
        method: "POST",
        headers: {
            "authorization": "Bearer " + process.env.FIREWORKS_TOKEN,
            "content-type": "application/json"
        },
        data: {
            "messages": msgs,
            "temperature": 1,
            "top_p": 1,
            "n": 1,
            "stream": false,
            "max_tokens": 500,
            "stop": null,
            "model": "accounts/fireworks/models/llama-v2-70b-chat"
        }
    }).catch(e => e.response ? console.log(e.response.data) : null);

    if (!res) {
        return "error"
    }

    let r = res.data.choices[0].message

    return r.content

}
exports.sendAMessage =  (phone_number_id, from, response) =>{
    axios({
        method: "POST",
        url: "https://graph.facebook.com/v18.0/" + phone_number_id + "/messages",
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
            Authorization: "Bearer " + process.env.WHATSAPP_TOKEN
        },
    }).catch(e => e.response ? console.log(e.response.data) : null);
}
