const {getResponse,sendAMessage}=require("./getResponse.js"),
  {AddConversation,GetConversations}=require("./addAndGetConversations")
let conversations = {}
let msgsFrom = {}

// this will receive the messages
exports.Post=async  (req, res)=> {
    // i check if the object is defined
    if (!req.body.object) {
      res.sendStatus(404);
      return
    }

  
    let entry = req.body.entry
    // then i check that the things that i will need are
    if (entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text === undefined) return
    let value = entry[0].changes[0].value
    // info that we need
  
    let phone_number_id = value.metadata.phone_number_id;// this is the id of the bot
    let from = value.messages[0].from;// whatsapp id faggoty shit
  
    let msg = value.messages[0].text.body; //this is another thing
    // for some reason the from doesnt return me the client number so i need to do this shit
    from = from.slice(0, 2) + from.slice(3, from.length)
    // check if the number exists in the history
    if (!conversations[from]) {
      conversations[from] =await GetConversations(from)
    }
    if (!msgsFrom[from]) {
      msgsFrom[from] = []
    }
    msgsFrom[from].push(msg)
    //gay info
    console.log("------------------------------")
    console.log("content:", msg)
    console.log("whatsapp id:", value.messages[0].from)
    console.log("from:", from)
    console.log("processing:", msgsFrom[from].length)
    console.log("------------------------------")
  
    //this is just for getting the history of conversations
    let userMsg = {
      role: "user",
      content: msg
    }
    await new Promise(r => {
      let interval = setInterval(() => {
        if (msgsFrom[from][0] != msg) {
          return
        }
        clearInterval(interval)
      }, 100)
      r()
    })
    // this is for generating a copy of the array, i dont want to make a reference to the original array
    let msgs = conversations[from].slice()
    msgs.push(userMsg)
    let response = await getResponse(msgs)
  
 
    conversations[from] = conversations[from].concat([userMsg, {
      role: "assistant",
      content: response
    }])
    msgsFrom[from].shift()
    //this will add stuff correctly
    await AddConversation(from,msg,response)
    //send msg
    sendAMessage(phone_number_id, from, response)
  
  
    res.sendStatus(200);
  
  
  }