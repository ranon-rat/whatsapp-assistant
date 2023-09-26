const sqlite3 = require('sqlite3').verbose();

function connectToDB() {
    return new sqlite3.Database('db/conversations.db');

}
exports.AddConversation =async  (from, role, content) => {
    const db = connectToDB()
    db.run("INSERT INTO history(fromNumber,role,content) VALUES (?1,?2,?3) ", from, role, content)
    db.close()
}
exports.GetConversations = async (from)=> {

    return new Promise((resolve, reject) => {
        const db = connectToDB()

        db.all("SELECT content,role FROM history WHERE FromNumber=?1 ORDER BY ID ASC", from, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.length>2?row:[{role:"system",content:""}]);
            }
        });
        db.close()
    });



}