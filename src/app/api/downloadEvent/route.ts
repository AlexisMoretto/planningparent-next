import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req: Request) {

    const {searchParams} = new URL(req.url);
    const email = searchParams.get('email')

    if(!email) {
        return NextResponse.json(
            {message : 'Email required'},
            {status: 400 }
        )
    }
    try {
        const events = await prisma.event.findMany({
            where:{
                email:email
            }
        })
        return NextResponse.json(events, {status:200})
    } catch (error) {
            console.error('Erreur lors de la récupération des événement');
            return NextResponse.json(
                {message: 'erreur lors de la récupération des événement'},
                {status: 500}
            )
        } finally {
            await prisma.$disconnect();
        }

}