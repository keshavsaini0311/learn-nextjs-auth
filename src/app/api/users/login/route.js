import {connect} from "@/dbconfig/dbconfig.js";
import People from "@/models/userModel.js";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


connect()

export async function POST(request) {
    try{
        const reqbody=await request.json();
        const {email,password}=reqbody;
        const user=await People.findOne({email});
        if(!user){
            return NextResponse.json({error:"User does not exist"},{status:400});
        }
        const validPassword=await bcrypt.compare(password,user.password);
        if(!validPassword){
            return NextResponse.json({error:"Invalid Password"},{status:400});
        }
        const tokenData={
            id:user._id,
            username:user.username,
            email:user.email,
        }
        const token= await jwt.sign(tokenData,process.env.token_secret,{expiresIn:"1d"});
        const response=NextResponse.json({
            message:"User logged in successfully",
            success:true,
            user
        });
        response.cookies.set("token",token,{httpOnly:true});
        return response;
    }
    catch(error){
        return NextResponse.json({ error: error.message }, { status: 500 });   
    }
}