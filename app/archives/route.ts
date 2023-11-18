import { NextResponse as res, NextRequest } from "next/server"
import { AddOrUpdateArchive } from "../database"
import {archiveProfile} from "../types"
export async function POST(req:NextRequest){
    const query = req.nextUrl.searchParams

    if(query.get("token")!=process.env.VERIFY_TOKEN){
        return res.json(
            { message: "something is weird" }
            , { status: 404 })
    }

    AddOrUpdateArchive(await req.json() as archiveProfile)
    return res.json(
        { message:"everything is fine" }
        , { status: 202 })
}