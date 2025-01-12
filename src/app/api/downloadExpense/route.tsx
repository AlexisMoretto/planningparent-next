import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient

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