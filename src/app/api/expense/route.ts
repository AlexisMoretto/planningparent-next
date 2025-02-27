import { Expense, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient();

export async function DELETE(request:Request) {

    try {
        const body: Expense = await request.json();
        const {reason, email}: Expense = body
        console.log("Données reçues dans la requête DELETE :", { reason, email });

        
        if (!email || !reason) {
            console.log('email,reason', email, reason);
            
            return NextResponse.json(
                {message: "Email et raison requis"},
                {status:400}
            )
        }
        
      
        const deleteExpense: {count:number} = await prisma.expense.deleteMany({
            where: {
                reason:reason,
                email:email,
            }
        })
        console.log("Résultat de la suppression Prisma :", deleteExpense);
        return NextResponse.json(
            { message: "Dépense supprimée avec succès" },
            {status:200}
        );
        
    } catch (error) {
        console.error("Erreur lors de la suppression de la dépense coté back")
        return NextResponse.json(
            {message: 'Erruer lors de la suppression coté back'},
            {status:500}
        )
    } finally {
        await prisma.$disconnect();
    }
}

export async function GET(request:Request) {
     const { searchParams }: URL = new URL(request.url)

    const email: string = searchParams.get('email')as string; 

    if(!email){
        return NextResponse.json(
            {message: 'email required'},
            {status:400}
        )
    }
    try {

        const expense: Expense[] = await prisma.expense.findMany({
            where:{email:email}
        })

        return NextResponse.json(expense, {status:200})

    } catch (error) {
        console.error('Erreur lors de la récupération des dépense')
        return NextResponse.json(
            {message: 'Erreur lors de la récupération des dépense'},
            {status: 500}
        )
        
    } finally {
        await prisma.$disconnect()
    }
}

export async function POST(req:Request) {

    // Onn créer un budget ou on le met a jour

    try { 

        const body:Expense = await req.json();

        const {expense, email, reason}: Expense = body

        if(!expense||!email||!reason){
            return NextResponse.json(
                {message : 'Tous les champs sont requis pour l\'envoi des données'},
                {status:400}
            )
        } else {
            console.log('vérification des expense reussi', expense, email, reason);           
        }

        const newExpense: Expense = await prisma.expense.create({
            data: {
                expense,
                reason,
                email
            }
        })
        return NextResponse.json(expense, {status:201})
        
    } catch (error) {
        console.error('Erreur lors de l\'envoi des dépenses')
        return NextResponse.json(
            {message: 'Erreur lors de l\envoi des des dépenses'},
            {status:500}
        )
    }
}