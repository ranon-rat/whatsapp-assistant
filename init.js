

/*
  this is for starting the db.
  you dont have to do a lot
  just get the URI and thats all
  You dont need anything else.
  ( 
    also, you have to use this in 
    your machine not in the service because 
    it will drop your tables and you will lost your data.
    edit the init.sql first before making any kind of change :)
  )
*/
require('dotenv').config();
const { Client } = require("pg")
const fs = require('fs');
const connectionString = process.env.URI


async function main() {
  const client = new Client({
    connectionString,
    ssl: true
  })

  await client.connect()
  fs.readFile("./db/init.sql", 'utf-8', async (_, c) => {
    await client.query(c)

  })
  await client.end()
}
main()