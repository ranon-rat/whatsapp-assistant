import { messageApi, messagesFlowise, archiveProfile, limitConversation } from "../types"
import { Client } from "pg"

const connectionString = process.env.URI 

async function connectToDB(): Promise<Client>{
    const client = new Client({
        connectionString,
        ssl:true
    })
    await client.connect()
    return client
}

export async function AddConversation(from: string, message: string, response: string) {
    const db =await  connectToDB()
    const querycmd = `INSERT INTO history(fromNumber,message,response) VALUES ($1,$2,$3)`
   await  db.query(querycmd, [from, message, response])
    await db.end()
}
export async function GetConversations(from: string): Promise<messagesFlowise[]> {

    const querycmd = "SELECT (message ,response) FROM history WHERE FromNumber=$1 ORDER BY ID ASC LIMIT $2"
    const db = await connectToDB()
    let rows = await db.query(querycmd,[from,limitConversation]).then(result => result.rows) as messageApi[]
let v=(rows.length > 0 ? rows.map(
    (r: messageApi): messagesFlowise[] => [
        { type: "userMessage", message: r.message || "error" },
        { type: "apiMessage", message: r.response || "error" }
    ]).flat() : []) as messagesFlowise[]
    await db.end()
    return v
}



export async function checkExistence(whatsappID: string): Promise<boolean> {
    const db = await connectToDB()
    const rows = await db.query("SELECT count(*) FROM archives where WhatsappID=$1", [whatsappID]).then(res => res.rows)
    await db.end()
    return Object.values(rows[0])[0] as number > 0
}
export async function AddOrUpdateArchive(archive: archiveProfile) {
    const db = await connectToDB(),
        whatsappID = archive.whatsappid,
        name = archive.name,
        company = archive.company,
        mbti = archive.mbti
    if (!await checkExistence(whatsappID)) {
        db.query("INSERT INTO archives(whatsappID) VALUES($1)", [whatsappID])
    }
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

    await db.end()
}
export async function GetArchives(query: string): Promise<archiveProfile[]> {
    const db =await  connectToDB();
    let rows: archiveProfile[] = (await db.query(`SELECT * FROM archives
        WHERE name LIKE $1 
          OR company LIKE $1 
          OR mbti LIKE $1
          OR whatsappid LIKE $1`, [`%${query||""}%`])).rows
    await db.end()
    return rows
}