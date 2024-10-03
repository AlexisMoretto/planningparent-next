import { NextResponse } from "next/server";
import { imgStore, userStore } from "src/app/store/store";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function storeInDB (url: string, email: string) {
  try{
    
    if (!email || !url) {
      return NextResponse.json({message: 'Pas d\image ou pas d\'email associé'})
    }
    const newImage = await prisma.familyImage.create({
      data : {
        url:url,
        email: email
      },
    });
    return NextResponse.json(newImage, {status:201})
    
  
   } catch (error: any) {
    return NextResponse.json({ message: 'Image creation failed', error: error.message }, {status: 500});
  }
}