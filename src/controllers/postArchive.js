
const  {AddOrUpdateArchive}= require ("./addAndGetConversations.js")
exports.PostArchives= function ArchivesPost(req, res){
    if(req.query["token"]!=process.env.VERIFY_TOKEN){
        res.sendStatus(400);
        return 
    }
    AddOrUpdateArchive(req.body)
    console.log(req.body)
    res.sendStatus(200)
}