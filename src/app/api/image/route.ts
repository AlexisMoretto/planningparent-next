import { familyImage, PrismaClient } from "@prisma/client";
import { error } from "console";
import { NextResponse } from "next/server";
import { userStore } from "src/app/store/store";

const prisma : PrismaClient= new PrismaClient()

export async function GET(request: Request) {

    // On viens chercher dans l'url l'email envoyé en param par le front 
    // searchParams est une propriété de l'objet URL. Elle permet d'extraire les paramètres présent dans l'url de la requete (après le ?) car le front envoi les paramètres dans l'url
    const { searchParams }: URL = new URL(request.url);

    // On peut donc récupérer l'eamil via la méthode .get 
    const email: string = searchParams.get('email') as string; 

    if (!email) {
        return NextResponse.json(
            { message: 'Email is required' },
            { status: 400 });
    }
    

    try{
        // On récupère toutes les images de la BDD
        const familyImage: familyImage[] = await prisma.familyImage.findMany({
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
export async function POST(req: Request) {
  try {
    const body:familyImage = await req.json();

    const {name, email, base64, firstName, mimeType }: familyImage = body;

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
    const newFamilyImage: familyImage = await prisma.familyImage.create({
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
export async function DELETE (req:Request) {

  const body: familyImage = await req.json();
  const {email, name, base64}: familyImage = body;

  if(!email || !name || !base64) {

    console.log('email, name, ppImg:', email, name, base64)
      return NextResponse.json("Element manquant pour la suppression")
  }

  try {
      const deletePeople: {count:number}= await prisma.familyImage.deleteMany ({
          where: {
            name:name,
            email:email,
            base64:base64
          }

      })
      return NextResponse.json(deletePeople)
  } catch (error) {
      return NextResponse.json(
          {message: "Erreur lors de la suppression coté back"},
          {status:500}
      )
  } finally {
      await prisma.$disconnect()
  }

}