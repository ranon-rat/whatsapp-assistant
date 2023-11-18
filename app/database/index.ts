import { messageApi, messagesFlowise, archiveProfile, limitConversation } from "../types"
import { Pool} from "pg"

const connectionString = process.env.URI 
const db = new Pool({
    connectionString,
    ssl:true
});
(async()=>
await db.connect()
)()
export async function AddConversation(from: string, message: string, response: string) {
    const querycmd = `INSERT INTO history(fromNumber,message,response) VALUES ($1,$2,$3)`
   await  db.query(querycmd, [from, message, response])
}
export async function GetConversations(from: string): Promise<messagesFlowise[]> {

    const querycmd = "SELECT (message ,response) FROM history WHERE fromnumber=$1 ORDER BY ID ASC LIMIT $2"
    let rows = await db.query(querycmd,[from,limitConversation]).then(result => result.rows) as messageApi[]

    return (rows.length > 0 ? rows.map(
        (r: messageApi): messagesFlowise[] => [
            { type: "userMessage", message: r.message || "error" },
            { type: "apiMessage", message: r.response || "error" }
        ]).flat() : []) as messagesFlowise[]
}



export async function checkExistence(whatsappID: string): Promise<boolean> {
    const count = await db.query("SELECT count(*) FROM archives where WhatsappID=$1", [whatsappID]).then(res => res.rows[0].count)
    return count as number > 0
}
export async function AddOrUpdateArchive(archive: archiveProfile) {
const        whatsappID = archive.whatsappid,
        name = archive.name,
        company = archive.company,
        mbti = archive.mbti
    if (!await checkExistence(whatsappID)) {
        db.query("INSERT INTO archives(whatsappID) VALUES($1)", [whatsappID])
    }

    console.log("------------------------------")
    console.log("whatsapp id:", whatsappID)
    console.log("name:", name)
    console.log("company:", company)
    console.log("mbti:",mbti)
    console.log("------------------------------")
   let query=[{ value: name, name: "name" },
    { value: company, name: "company" },
    { value: mbti, name: "mbti" }]
    for(let v of query){
        if(!v.value||["", "unknown", "desconocido"].includes(v.value)){
            continue
        }
        await db.query(`UPDATE archives 
        set ${v.name}=$1 
        where whatsappID=$2`, [v.value, whatsappID])
    }

    }
export async function GetArchives(query: string): Promise<archiveProfile[]> {
    let rows: archiveProfile[] = (await db.query(`SELECT * FROM archives
        WHERE name LIKE $1 
          OR company LIKE $1 
          OR mbti LIKE $1
          OR whatsappid LIKE $1`, [`%${query||""}%`])).rows
    return rows
}