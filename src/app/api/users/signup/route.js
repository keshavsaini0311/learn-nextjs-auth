import {connect} from "@/dbconfig/dbconfig.js";
import People from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";


connect()

export async function POST(request) {
    try {
        const reqbody=await request.json();
        const {email,username,password}=reqbody;

        const user=await People.findOne({email});
        if(user){
            return NextResponse.json({error:"User already exists"},{status:400});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new People({email,username,password:hashedPassword});
        await newUser.save();

        return NextResponse.json({message:"User created successfully",success:true},{status:201});
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });   
    }
}