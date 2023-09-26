const sqlite3 = require('sqlite3').verbose();

function connectToDB() {
    return new sqlite3.Database('db/conversations.db');

}

exports.AddConversation = async (from, message, response) => {
    const db = connectToDB()
    db.run("INSERT INTO history(fromNumber,message,response) VALUES (?1,?2,?3) ", from, message, response)
    db.close()
}
exports.GetConversations = async (from) => {

    return new Promise((resolve, reject) => {
        const db = connectToDB()

        db.all("SELECT message,response FROM history WHERE FromNumber=?1 ORDER BY ID ASC", from, (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row.length > 0 ? row.map(r => [
                    { role: "user", content: r.message },
                    { role: "assistant", content: r.response }]).flat() : []);
            }
        });
        db.close()
    });



}