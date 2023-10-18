const express=require("express");
const controller=require("../controllers")
const router = express.Router();

module.exports=function(){
    router.get("/webhook",controller.GetWebhook)
    router.post("/webhook",controller.PostWebhook)
    router.post("/archive",controller.PostArchives)
    router.get("/archive",controller.GetArchives)
    router.use("/", express.static("./static"));
    return router
}