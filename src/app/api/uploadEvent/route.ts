import { Event, Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

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