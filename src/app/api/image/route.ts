import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { imgStore, userStore } from "src/app/store/store";
import {put} from '@vercel/blob'
import { error } from "console";


const prisma = new PrismaClient();

export async function POST(req: NextRequest) {

  if (req.method === 'POST') {
        // -----Methode permettant de mettre l'url dans la BDD---------
    try{

      const {url} = imgStore.getState() 
      console.log('url', url);
      
      const {email} = userStore.getState()

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


 
}

 

