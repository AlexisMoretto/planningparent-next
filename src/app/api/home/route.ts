import { Event, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function GET(req:Request) {
    try {
    const {searchParams} = new URL (req.url);

    const email= searchParams.get('email')
    const nameConcerned = searchParams.get('nameConcerned')

    console.log("Requête API - email:", email, "nameConcerned:", nameConcerned);

    if(!email || ! nameConcerned) {
        return NextResponse.json(
            {message:"email et nameConcerned requis"},
            {status:400}
        )
    }
    
        const event = await prisma.event.findMany({
            where: {
                email: email,
                nameConcerned:nameConcerned
            }
        })
        console.log("Événements trouvés :", event); 
        return NextResponse.json(event, {status:200})
    
    } catch (error) {
        return NextResponse.json(
            {message: "Erreur lors de la récup des evt pour la parti home"},
            {status:500}
        )
    }
}
