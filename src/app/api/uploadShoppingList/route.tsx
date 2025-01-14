import { PrismaClient, Shopping } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

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
        return NextResponse.json(name, {status:201})
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'article')
        return NextResponse.json(
            {message: 'Erreur lors de l\envoi des de l\'article'},
            {status:500}
        )
    }
}