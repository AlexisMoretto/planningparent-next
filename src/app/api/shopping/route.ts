import { PrismaClient, Shopping } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient()

export async function DELETE (req: Request) {
    const body = await req.json()
    const {email, name} = body
    console.log(email, name);
    
    if(!email && !name) {
        console.log("email ou nom de l'article manquant", email, name);       
        return NextResponse.json(
            {message: "email ou nom de l'article manquant"},
            {status: 400}
        ) 
    } 
    try {
        
        const deleteArticle = await prisma.shopping.deleteMany({
            where: {
                name:name,
                email: email
            }
        })
        return NextResponse.json(
            { message: "Article supprimée avec succès" }
        );

    } catch (error) {
        console.error("Erreur lors de la suppression de la l'article coté back")
        return NextResponse.json(
            {message: 'Erruer lors de la suppression coté back'},
            {status:500}
        )
    } finally {
        await prisma.$disconnect();
    }
}
export async function GET(request:Request) {
     const { searchParams } = new URL(request.url)

    const email = searchParams.get('email'); 
    
    if(!email){
        return NextResponse.json(
            {message: 'email required'},
            {status:400}
        )
    }
    try {

        const shoppingList = await prisma.shopping.findMany({
            where:{email:email}
        })

        return NextResponse.json(shoppingList, {status:200})

    } catch (error) {
        console.error('Erreur lors de la récupération des articles')
        return NextResponse.json(
            {message: 'Erreur lors de la récupération des articles'},
            {status: 500}
        )
        
    } finally {
        await prisma.$disconnect()
    }
}
export async function POST(req:Request) {

    try { 

        const body = await req.json();

        const {name, email}: Shopping = body

        if(!name||!email){
            return NextResponse.json(
                {message : 'Tous les champs sont requis pour l\'envoi des données'},
                {status:400}
            )
        } else {
            console.log('vérification des informations reussi', name, email);           
        }

        const newArticle = await prisma.shopping.create({
            data: {
                name,
                email
            }
        })
        return NextResponse.json(newArticle, {status:201})
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'article')
        return NextResponse.json(
            {message: 'Erreur lors de l\envoi des de l\'article'},
            {status:500}
        )
    }
}