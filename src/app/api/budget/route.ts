import { Budget, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient()

export async function GET (request: Request){

    const {searchParams}: URL = new URL(request.url);
    const email: string  | null = searchParams.get('email')

    if (!email) {
        return NextResponse.json(
            {message : 'Email required'},
            {status: 400 }
        )
    }
    try {
        
        // On récupère le budget en fonction de l'email

        const budget: Budget | null = await prisma.budget.findUnique({
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
export async function POST (req: NextRequest) {

    try {
        
        const body: Budget = await req.json();

        const { email, budget}: Budget= body

        // Vérification des données requises pour l'envoi

        if(!budget || !email){
            return NextResponse.json(
                {message: "Tout les champs sont requis"},
                {status:400},
            )
        } else {
            console.log('Vérification reussi');
            
        }
        const newBudget: Budget = await prisma.budget.upsert({
            where: { email:email },
            update: { budget:budget},
            create: {email:email, budget:budget }
        });
        return NextResponse.json(newBudget, {status:201});
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données lié au montant du  budget')
        return NextResponse.json(
            {message: "Ereur lors e l'enregistrement"},
            {status:500}
        )
    }
}