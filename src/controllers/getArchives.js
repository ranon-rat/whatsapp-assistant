const {GetArchives}= require ("./addAndGetConversations.js")
exports.GETArchives=async(req,res)=>{
    const search=req.query["search"]
    const archives=await GetArchives(search)
    res.json(archives)
}