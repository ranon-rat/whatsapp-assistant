import sqlite3 from "sqlite3"
import { messageApi, messagesFlowise,archiveProfile,limitConversation } from "@/app/types"

function connectToDB() {
    return new sqlite3.Database('db/conversations.db');

}

export async function AddConversation(from: string, message: string, response: string) {
    const db = connectToDB()
    db.run("INSERT INTO history(fromNumber,message,response) VALUES (?1,?2,?3) ", from, message, response)
    db.close()
}
export async function GetConversations(from: string): Promise<messagesFlowise[]> {

    return new Promise((resolve, reject) => {
        const db = connectToDB()

        db.all("SELECT message,response FROM history WHERE FromNumber=?1 ORDER BY ID ASC LIMIT=?2", [from,limitConversation], (err, row: messageApi[]) => {
            if (err) {
                reject(err);
            } else {
                resolve((row.length > 0 ? row.map((r: messageApi): messagesFlowise[] => [
                    { type: "userMessage", message: r.message || "error" },
                    { type: "apiMessage", message: r.response || "error" }
                ]).flat() : []) as messagesFlowise[]);
            }
        });
        db.close()
    });
}



export async function checkExistence(whatsappID:string):Promise<boolean> {
    return new Promise((resolve, reject) => {
        const db = connectToDB()

        db.get("SELECT count(*) FROM archives where WhatsappID=?1", whatsappID, (err, row:Object) => {
            if (err) {
                reject(err)
                return
            }
            resolve(Object.values(row)[0] > 0)
        })
        db.close()
    })
}
export async function AddOrUpdateArchive(archive:archiveProfile){
    const db = connectToDB(),
        whatsappID = archive.WhatsappID,
        name = archive.Name,
        company = archive.Company,
        mbti = archive.MBTI
    if (!await checkExistence(whatsappID)) {
        db.run("INSERT INTO archives(whatsappID) VALUES(?1)", whatsappID)
    }
    [{ value: name, name: "name" },
    { value: company, name: "company" },
    { value: mbti, name: "MBTI" }].map(v => {
        v.value && ["","unknown","desconocido","anon"].includes(v.value)
        ? db.run(`UPDATE archives set ${v.name}==?1 where whatsappID=?2`, v.value, whatsappID) : 
        null
    })
}
export async function GetArchives(query:string):Promise<archiveProfile[]>{

    return new Promise((resolve, reject) => {
        const db = connectToDB();
        db.all(`SELECT * FROM archives
                WHERE name LIKE ?1 
                  OR company LIKE ?1 
                  OR mbti LIKE ?1
                  OR whatsappID LIKE ?1`, `%${query}%`, (err, rows:archiveProfile[]) => {
            if (err) {
                reject(err)
                return
            }
            resolve(rows)
        })
    })
}