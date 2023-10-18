exports.GetWebhook=function GetWebhook(req, res){


    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
    if (!mode && !token) return // i check if they are defined
    // i check if both of the requisites are fulfilled
    if (mode !== "subscribe" && token !== process.env.VERIFY_TOKEN) {
      res.sendStatus(403);
      return
    }
    // in the case that everything is fine then i will return that is completely okay
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  
  }