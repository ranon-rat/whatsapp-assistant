const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('db/conversations.db');
db.run("CREATE TABLE history(ID INTEGER ,fromNumber VARCHAR(15),message TEXT,response TEXT,PRIMARY KEY (ID))")
db.run(`CREATE TABLE archives(
    WhatsappID TEXT,
    Name TEXT,
    Company TEXT,
    MBTI TEXT
  );`)