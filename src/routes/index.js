const express=require("express");
const controller=require("../controllers")
const router = express.Router();

module.exports=function(){
    router.get("/webhook",controller.Get)
    router.post("/webhook",controller.Post)
    return router
}