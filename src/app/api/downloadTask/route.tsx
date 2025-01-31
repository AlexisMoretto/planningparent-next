import { PrismaClient, Task } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET( req: Request) {

    const {searchParams} = new URL (req.url);
    const email: Task = searchParams.get('email')
    const nameConcerned = searchParams.get('nameConcerned')

    if(!email && !nameConcerned) {
        return NextResponse.json(
            {message: 'email ou nom manquant'},
            {status: 400}
        )
    }
    try {

        const tasks = await prisma.task.findMany({
            where: {
                email:email,
                nameConcerned
            }
        })

    } catch (error) {
        console.error("Erreur lors de la récupération des information des tache et des evts coté back");
        return NextResponse.json(
            {message: 'Erreur lors de la récupération des information des tache et des evts coté back'},
            {status: 500}
        )
    }
}