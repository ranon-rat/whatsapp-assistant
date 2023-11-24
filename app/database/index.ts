import { messageApi, messagesFlowise, archiveProfile, limitConversation } from "../types"
import { Client } from "pg"

const connectionString = process.env.URI
async function connectToDB(): Promise<Client> {
    const client = new Client({
        connectionString,
        ssl: true
    })
    await client.connect()
    return client
}
//

export async function AddConversation(from: string, message: string, response: string) {
    const db = await connectToDB();
    const querycmd = `INSERT INTO history(fromNumber,message,response) VALUES ($1,$2,$3)`
    await db.query(querycmd, [from, message, response])
    await db.end()
}
export async function GetConversations(from: string): Promise<messagesFlowise[]> {
    const db = await connectToDB();
    const querycmd = "SELECT message ,response FROM history WHERE fromnumber=$1 ORDER BY ID DESC LIMIT $2"
    let rows = await db.query(querycmd, [from, limitConversation]).then(result => result.rows) as messageApi[]
    await db.end()
    return (rows.length > 0 ? rows.map(
        (r: messageApi): messagesFlowise[] => [
            { type: "apiMessage", message: r.response  },
            { type: "userMessage", message: r.message  },

        ]).flat() : []).reverse() as messagesFlowise[]
}



export async function checkExistence(whatsappID: string): Promise<boolean> {
    const db = await connectToDB();
    const count = await db.query("SELECT count(*) FROM archives where WhatsappID=$1", [whatsappID]).then(res => res.rows[0].count)
    await db.end()
    return count as number > 0
}
export async function AddOrUpdateArchive(archive: archiveProfile) {
    const db = await connectToDB();
    const whatsappID = archive.whatsappid,
        name = archive.name,
        company = archive.company,
        mbti = archive.mbti
    if(["","unknown"].includes(whatsappID)){
        return
    }
    if (!await checkExistence(whatsappID)) {
        await db.query("INSERT INTO archives(whatsappID) VALUES($1)", [whatsappID])
    }

    console.log("------------TOOL--------------")
    console.log("whatsapp id:", whatsappID)
    console.log("name:", name)
    console.log("company:", company)
    console.log("mbti:", mbti)
    console.log("------------TOOL--------------")
    let query = [{ value: name, name: "name" },
    { value: company, name: "company" },
    { value: mbti, name: "mbti" }]
    for (let v of query) {
        if (!v.value || ["",
         "unknown",
          "desconocido",
          "anonymous",
          "anon",
          "anonimo",
          "anonymous"].includes(v.value.toLowerCase())) {
            continue
        }
        await db.query(`UPDATE archives 
        set ${v.name}=$1 
        where whatsappID=$2`, [v.value, whatsappID])
    }
    await db.end()
}
export async function GetArchives(query: string): Promise<archiveProfile[]> {
    const db = await connectToDB();
    let rows: archiveProfile[] = (await db.query(`SELECT * FROM archives
        WHERE name LIKE $1 
          OR company LIKE $1 
          OR mbti LIKE $1
          OR whatsappid LIKE $1`, [`%${query || ""}%`])).rows
    await db.end();
    return rows
}