import { Event,  PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient;

export async function DELETE(request:Request) {

    const body: Event = await request.json();
    const {eventName, email, nameConcerned}: Event = body
    console.log("corps de la requete: ", body);
    
    if (!email || !eventName || !nameConcerned) {
        console.log('email,eventName, nameCOncerned', email, eventName, nameConcerned);
        
        return NextResponse.json(
            {message: "email,eventName, nameCOncerned requis"},
            {status:400}
        )
    }
    try {

        const deleteExpense: {count:number} = await prisma.event.deleteMany({
            where: {
                eventName,
                email:email,
                nameConcerned
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

    const {searchParams}: URL = new URL(req.url);
    const email:string = searchParams.get('email') as string

    if(!email) {
        return NextResponse.json(
            {message : 'Email required'},
            {status: 400 }
        )
    }
    try {
        const events: Event[] = await prisma.event.findMany({
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

        const body: Event = await req.json();

        const {eventName, eventTime,eventDate, email, nameConcerned }: Event = body
        
        if(!eventName||!eventTime||!email||!eventDate) {
            return NextResponse.json(
                {message : 'Tous les champs sont requis pour l\'envoi des données'},
                {status:400}
            )
        } else {
            console.log('vérification des données reussi', eventName, email, eventTime, eventDate); 
            
        }
        console.log("Corps de la requete: ", eventName, eventTime,eventDate, email, nameConcerned );

        const newEvent: Event = await prisma.event.create({
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



