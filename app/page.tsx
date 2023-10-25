import {  NextRequest } from "next/server"
import {search,login,table} from "@/app/parts"
import {Params} from "@/app/types"
import { FormEvent, useState } from "react"


export default function Home(req:Params){
    const token=req.searchParams.token
    if(token!==process.env.VERIFY_TOKEN){
        return <div>
            {login()}
        </div>

    }
 return <div>
{search(req.searchParams.token!)}
{table(req.searchParams.search!)}

 </div>
 
}