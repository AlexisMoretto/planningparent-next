import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient()

export async function DELETE (req: Request) {
    const body = await req.json()
    const {email, name} = body

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