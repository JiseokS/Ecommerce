import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(
    req: Request,
) {
    try{
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unathorized", {status: 401})
        }
    }catch (error){ //error handling
        console.log('[STORES_POST]', error);
        return new NextResponse("Interal error", {status: 500})
    }
}