import { Prisma, PrismaClient, Task } from "@prisma/client";
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
export async function GET( req: Request) {

    const {searchParams} = new URL (req.url);
    const email = searchParams.get('email') as string
    const nameConcerned = searchParams.get('nameConcerned') as string

    if(!email && !nameConcerned) {
        return NextResponse.json(
            {message: 'email ou nom manquant'},
            {status: 400}
        )
    }
    try {

        const tasks: Task[] = await prisma.task.findMany({
            where: {
                email:email,
                nameConcerned:nameConcerned
            }
        })
        return NextResponse.json(tasks, {status:200})
    } catch (error) {
        console.error("Erreur lors de la récupération des information des tache et des evts coté back");
        return NextResponse.json(
            {message: 'Erreur lors de la récupération des information des tache et des evts coté back'},
            {status: 500}
        )
    }
}
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