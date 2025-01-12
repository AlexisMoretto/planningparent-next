import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient

export async function GET (request: Request){

    const {searchParams} = new URL(request.url);
    const email = searchParams.get('email')

    if (!email) {
        return NextResponse.json(
            {message : 'Email required'},
            {status: 400 }
        )
    }
    try {
        
        // On récupère le budget en fonction de l'email

        const budget = await prisma.budget.findUnique({
            where: {
                email:email
            }
        })

        return NextResponse.json(budget, {status:200})

    } catch (error) {
        console.error('Erreur lors de la récupération du budget');
        return NextResponse.json(
            {message: 'erreur lors de la récupération du budget'},
            {status: 500}
        )
    } finally {
        await prisma.$disconnect();
    }
}