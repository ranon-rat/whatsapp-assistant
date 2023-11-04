import { messageApi, messagesFlowise, archiveProfile, limitConversation } from "@/app/types"
import { Client } from "pg"

const connectionString = process.env.URI 

function connectToDB(): Client {
    return new Client({
        connectionString,
        ssl:true
    })
}

export async function AddConversation(from: string, message: string, response: string) {
    const db = connectToDB()
    const querycmd = `INSERT INTO history(fromNumber,message,response) VALUES ($1,$2,$3)`
    
    db.query(querycmd, [from, message, response])
    await db.end()
}
export async function GetConversations(from: string): Promise<messagesFlowise[]> {

    const querycmd = "SELECT message ,response FROM history WHERE FromNumber=$1 ORDER BY ID ASC LIMIT=$2"
    const db = connectToDB()
    let rows = await db.query(querycmd,[from,limitConversation]).then(result => result.rows) as messageApi[]

    await db.end()
    return (rows.length > 0 ? rows.map(
        (r: messageApi): messagesFlowise[] => [
            { type: "userMessage", message: r.message || "error" },
            { type: "apiMessage", message: r.response || "error" }
        ]).flat() : []) as messagesFlowise[]
}



export async function checkExistence(whatsappID: string): Promise<boolean> {
    const db = connectToDB()
    const rows = await db.query("SELECT count(*) FROM archives where WhatsappID=$1", [whatsappID]).then(res => res.rows)
    await db.end()
    return Object.values(rows[0])[0]! > 0
}
export async function AddOrUpdateArchive(archive: archiveProfile) {
    const db = connectToDB(),
        whatsappID = archive.WhatsappID,
        name = archive.Name,
        company = archive.Company,
        mbti = archive.MBTI
    if (!await checkExistence(whatsappID)) {
        db.query("INSERT INTO archives(whatsappID) VALUES($1)", [whatsappID])
    }
    [{ value: name, name: "name" },
    { value: company, name: "company" },
    { value: mbti, name: "MBTI" }].map(v => {
        v.value && ["", "unknown", "desconocido", "anon"].includes(v.value)
            ? db.query(`UPDATE archives 
            set ${v.name}==$1 
            where whatsappID=$2`, [v.value, whatsappID]) :
            null
    })
    await db.end()
}
export async function GetArchives(query: string): Promise<archiveProfile[]> {

    const db = connectToDB();
    let rows: archiveProfile[] = await db.query(`SELECT * FROM archives
        WHERE name LIKE $1 
          OR company LIKE $1 
          OR mbti LIKE $1
          OR whatsappID LIKE $1`, [query]).then(r => r.rows)

    await db.end()
    return rows
}