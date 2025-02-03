import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function DELETE (req: Request){
    const body = await req.json();

    const {taskName, email, nameConcerned} = body;

    if(!email|| !taskName || !nameConcerned){
        return NextResponse.json(
            {message: "email ou nom de la tache manquante"},
            {status:400}
        ) 
    }
    try {
        const deleteTask = await prisma.task.deleteMany({
            where: {
                taskName: taskName,
                nameConcerned: nameConcerned
            }
        })
        return NextResponse.json(
            {message: "Tache supprimé avec succès"},
            {status:200}
    )
    } catch (error) {
        console.error(
            {message: "Erreur lors de la suppression de la tache coté back"}
            
            )
            return NextResponse.json(
                {message: "Erreur lors de la suppression de la tache coté back"},
                {status:500}
        );
        
    } finally {
        await prisma.$disconnect();
    }
}