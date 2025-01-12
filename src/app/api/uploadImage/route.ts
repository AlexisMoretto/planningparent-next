import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {name, email, base64, firstName, mimeType } = body;

    // Vérification des données requises
    if (!email || !base64 || !firstName || !name || !mimeType) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 },
        
        
      );
      
    } else {
      console.log("Vérification réussi");  
      console.log('le base64 envoyé par le front est bon');    
    }

    // Enregistrer dans la base de onnées avec les données envoyé par le front, les données utilisateur via le reducer et le format de l'image via la variable base64
    const newFamilyImage = await prisma.familyImage.create({
      data: {
        email,
        base64,
        firstName,
        name,
        mimeType,
        
      }, 
      
      
    });
    return NextResponse.json(newFamilyImage, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'enregistrement"},
      { status: 500 }
    );
  }
}
