//<s>[INST][/INST]</s>
const { getResponse, sendAMessage } =require ("./getResponse.js")
const  { AddConversation, GetConversations } =require ("./addAndGetConversations")
const DEV=true
let conversations = {}
let msgsFrom = {}

// this will receive the messages
exports.PostWebhook= async function PostWebhook  (req, res) {
  const limitConversation = 10

  // i check if the object is defined
  if (!req.body.object) {
    res.sendStatus(404);
    return
  }
  let entry = req.body.entry
  if (entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text === undefined) {
    res.sendStatus(200);
    return
  }

  //------------------------------//
  let value = entry[0].changes[0].value
  //whatsapp info that i need to check
  let phone_number_id = value.metadata.phone_number_id;// this is the id of the bot
  let from = value.messages[0].from;// whatsapp id faggoty shit
  let msg = value.messages[0].text.body;
  //------------------------------//

  if(DEV)from = from.slice(0, 2) + from.slice(3, from.length) // this get me the client number
  // check if the number exists in the conversation history
  if (!conversations[from]) {
    conversations[from] = await GetConversations(from)
    if (conversations[from].length > limitConversation) {// this will avoid overflowing the api

      conversations[from] = conversations[from].slice(conversations[from].length - limitConversation)

    }
  }
  // this will mantain a certain order in the conversation
  if (!msgsFrom[from]) {
    msgsFrom[from] = []
  }
  msgsFrom[from].push(msg)
  // if you want to have some logs
  console.log("------------------------------")
  console.log("content:", msg)
  console.log("whatsapp id:", value.messages[0].from)
  console.log("from:", from)
  console.log("processing:", msgsFrom[from].length)
  console.log("------------------------------")

  // this little promise is just checking that is our turn to send a message
  await new Promise(r => {
    let interval = setInterval(() => {
      if (msgsFrom[from][0] != msg) {
        return
      }
      clearInterval(interval)
    }, 100)
    r()
  })
  //--------------------------------------

  let response = await getResponse({
    "question":   "whatsappID: " + from + ";prompt: " + msg,
    "history": conversations[from],
    "overrideConfig": {
      "returnSourceDocuments": true
    }
  })

  //--------------------------------------
  //things that will keep this working

  conversations[from] = conversations[from].concat([{
    type: "userMessage",
    message: msg
  }, {
    type: "apiMessage",
    message: response
  }])//we need context
  msgsFrom[from].shift()//we need to mantain the order
  await AddConversation(from, msg, response)//and we need to save this to the db
  sendAMessage(phone_number_id, from, response)  //send msg
  if (conversations[from].length > limitConversation) {// this will avoid overflowing the api

    conversations[from] = conversations[from].slice(conversations[from].length - limitConversation)

  }
  res.sendStatus(200);


}