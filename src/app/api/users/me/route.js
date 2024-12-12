import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest,NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import People from "@/models/userModel";

connect();
export async function GET(request) {
    try {
        const id = await getDataFromToken(request);
        const user = await People.findById(id).select("-password"); 
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}