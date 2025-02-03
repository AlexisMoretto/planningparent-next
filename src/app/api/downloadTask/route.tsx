import { PrismaClient, Task } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

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