const sqlite3 =require( "sqlite3")

function connectToDB() { 
  return new sqlite3.Database('db/conversations.db');

}

exports. AddConversation = async (from, message, response) => {
  const db = connectToDB()
  db.run("INSERT INTO history(fromNumber,message,response) VALUES (?1,?2,?3) ", from, message, response)
  db.close()
}
exports. GetConversations = async (from) => {

  return new Promise((resolve, reject) => {
    const db = connectToDB()

    db.all("SELECT message,response FROM history WHERE FromNumber=?1 ORDER BY ID ASC", from, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row.length > 0 ? row.map(r => [
          { type: "userMessage", message: r.message || "error" },
          { type: "apiMessage", message: r.response || "error" }]).flat() : []);
      }
    });
    db.close()
  });
}



async function checkExistence(whatsappID) {
  return new Promise((resolve, reject) => {
    const db = connectToDB()

    db.get("SELECT count(*) FROM archives where WhatsappID=?1", whatsappID, (err, row) => {
      if (err) {
        reject(err)
        return
      }
      resolve(Object.values(row)[0] > 0)
    })
    db.close()
  })
}

exports. AddOrUpdateArchive = async (obj) => {
  const db = connectToDB(),
    whatsappID = obj.whatsappID,
    name = obj.name,
    company = obj.company,
    mbti = obj.MBTI
  if (!await checkExistence(whatsappID)) {
    db.run("INSERT INTO archives(whatsappID) VALUES(?1)", whatsappID)
  }
  [{ value: name, name: "name" },
  { value: company, name: "company" },
  { value: mbti, name: "MBTI" }].map(v => {
    v.value&& v.value!="" ? db.run(`UPDATE archives set ${v.name}==?1 where whatsappID=?2`, v.value, whatsappID) : null
  })
}
exports. GetArchives = async (query) => {
  return new Promise((resolve, reject) => {
    const db = connectToDB();
    db.all(`SELECT * FROM archives
                WHERE name LIKE ?1 
                  OR company LIKE ?1 
                  OR mbti LIKE ?1
                  OR whatsappID LIKE ?1`, `%${query}%`, (err, rows) => {
      if (err) {
        reject(err)
        return
      }
      resolve(rows)
    })
  })
}