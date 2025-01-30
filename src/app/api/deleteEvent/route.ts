import { Event,  PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient;

export async function DELETE(request:Request) {

    const body = await request.json();
    const {eventName, email} = body

    if (!email && !eventName) {
        console.log('email,eventName', email, eventName);
        
        return NextResponse.json(
            {message: "Email et raison requis"},
            {status:400}
        )
    }
    try {

        const deleteExpense = await prisma.event.deleteMany({
            where: {
                eventName,
                email:email,

            }
        })
        return NextResponse.json(
            { message: "Event supprimée avec succès" }
        );
        
    } catch (error) {
        console.error("Erreur lors de la suppression de l'event coté back")
        return NextResponse.json(
            {message: 'Erruer lors de la suppression coté back'},
            {status:500}
        )
    } finally {
        await prisma.$disconnect();
    }
}