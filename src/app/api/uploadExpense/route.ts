import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

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