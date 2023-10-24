require('dotenv').config()
// dependencies
const  express=require( "express") 
const {json} = require('body-parser');
const rout =require("./src/routes")

const   app = express().use(json());
app.listen(process.env.PORT || 3000, () => console.log("webhook is listening"));
// this will work for adding new stuff

app.use("/", rout())

