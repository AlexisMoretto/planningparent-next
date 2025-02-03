import { PrismaClient, Task } from "@prisma/client";
import { NextResponse } from "next/server";
import { aW, el } from "node_modules/@fullcalendar/core/internal-common";

const prisma = new PrismaClient

export async function POST(req:Request) {
    
    try {
        const body = await req.json();
        const {email, nameConcerned, taskName } = body

        if (!nameConcerned || !email || !taskName ) {
            return NextResponse.json(
                {message : "Email ou nom de la personne manquante"},
                {status:400}
            )
        } else {
            console.log("Verification reussi");
            
        }

        const newTask: Task = await prisma.task.create({
            data: { 
                email,
                nameConcerned,
                taskName,
            }
        })
        return NextResponse.json(newTask, {status:201})
    } catch (error) {
        return NextResponse.json(
            {message:"Erreur lors de l'envoi des données Task coté back"}, 
            {status:500}
        )
    }

}