import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {name, email, base64, firstName } = body;

    // Vérification des données requises
    if (!email || !base64 || !firstName) {
      return NextResponse.json(
        { message: "Tous les champs sont requis" },
        { status: 400 }
      );
    } else {
      console.log("Vérification réussi");
      
    }

    // Enregistrer dans la base de données
    const newFamilyImage = await prisma.familyImage.create({
      data: {
        email,
        base64,
        firstName,
        name,
      }, 
    });
    console.log(newFamilyImage);
    return NextResponse.json(newFamilyImage, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la sauvegarde :", error);
    return NextResponse.json(
      { message: "Erreur lors de l'enregistrement"},
      { status: 500 }
    );
  }
}
