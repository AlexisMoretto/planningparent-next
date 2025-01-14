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