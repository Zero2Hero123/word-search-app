import { NextResponse } from "next/server";



export async function GET(){

    const data = ['hero','better','yes','amazing']

    return NextResponse.json({ data })
}