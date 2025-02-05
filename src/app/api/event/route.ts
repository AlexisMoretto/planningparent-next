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
            { message: "Event supprimée avec succès" },
            {status:200}
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

export async function POST(req:Request) {
    try {

        const body = await req.json();

        const {eventName, eventTime,eventDate, email, nameConcerned }: Event = body

        if(!eventName||!eventTime||!email||!eventDate) {
            return NextResponse.json(
                {message : 'Tous les champs sont requis pour l\'envoi des données'},
                {status:400}
            )
        } else {
            console.log('vérification des données reussi', eventName, email, eventTime, eventDate); 
            
        }

        const newEvent = await prisma.event.create({
            data: {
                nameConcerned,
                eventName, 
                eventTime,
                eventDate: new Date(eventDate),
                email, 
                
                
            }
        })
        return NextResponse.json(newEvent, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'event')
                return NextResponse.json(
                    {message: 'Erreur lors de l\envoi de l\'event'},
                    {status:500}
                )
    }
}