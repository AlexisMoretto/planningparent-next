import { Meal,  PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient;

export async function DELETE(request:Request) {

    const body = await request.json();
    const {name, email} = body

    if (!email && !name) {
        console.log('email,name', email, name);
        
        return NextResponse.json(
            {message: "Email et raison requis"},
            {status:400}
        )
    }
    try {

        const deleteExpense = await prisma.meal.deleteMany({
            where: {
                name,
                email:email,

            }
        })
        return NextResponse.json(
            { message: "Repas supprimée avec succès" }
        );
        
    } catch (error) {
        console.error("Erreur lors de la suppression du repas coté back")
        return NextResponse.json(
            {message: 'Erruer lors de la suppression coté back'},
            {status:500}
        )
    } finally {
        await prisma.$disconnect();
    }
}