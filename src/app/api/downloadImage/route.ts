import { PrismaClient } from "@prisma/client";
import { error } from "console";
import { NextResponse } from "next/server";
import { userStore } from "src/app/store/store";

const prisma = new PrismaClient()

export async function GET(request: Request) {

    // On viens chercher dans l'url l'email envoyé en param par le front 
    // searchParams est une propriété de l'objet URL. Elle permet d'extraire les paramètres présent dans l'url de la requete (après le ?) car le front envoi les paramètres dans l'url
    const { searchParams } = new URL(request.url);

    // On peut donc récupérer l'eamil via la méthode .get 
    const email = searchParams.get('email'); 

    if (!email) {
        return NextResponse.json(
            { message: 'Email is required' },
            { status: 400 });
    }
    

    try{
        // On récupère toutes les images de la BDD
        const familyImage = await prisma.familyImage.findMany({
            where: {
                email: email           
            }
            
        });
        
        return NextResponse.json(familyImage, {status:200})
        

    } catch {
        console.error('Erreur lors de la récupération:', error)
        return NextResponse.json({ message: "Erreur lors de la récupération des images"}),{ status: 500 }
    } finally {
        await prisma.$disconnect();
      }
    
}