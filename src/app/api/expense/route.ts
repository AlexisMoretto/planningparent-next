import { Expense, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient;

export async function DELETE(request:Request) {

    const body = await request.json();
    const {reason, email} = body

    if (!email && !reason) {
        console.log('email,reason', email, reason);
        
        return NextResponse.json(
            {message: "Email et raison requis"},
            {status:400}
        )
    }
    try {

        const deleteExpense = await prisma.expense.deleteMany({
            where: {
                reason:reason,
                email:email,

            }
        })
        return NextResponse.json(
            { message: "Dépense supprimée avec succès" }
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
     const { searchParams } = new URL(request.url)

    const email = searchParams.get('email'); 

    if(!email){
        return NextResponse.json(
            {message: 'email required'},
            {status:400}
        )
    }
    try {

        const expense = await prisma.expense.findMany({
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

    try { 

        const body = await req.json();

        const {expense, email, reason} = body

        if(!expense||!email||!reason){
            return NextResponse.json(
                {message : 'Tous les champs sont requis pour l\'envoi des données'},
                {status:400}
            )
        } else {
            console.log('vérification des expense reussi', expense, email, reason);           
        }

        const newExpense = await prisma.expense.create({
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