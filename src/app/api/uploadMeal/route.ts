import { Meal, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

export async function POST(req:Request) {
    try {

        const body = await req.json();

        const {name, mealDate, email }= body
        console.log("Body reçu dans la requête :", body);

        if(!name||!email||!mealDate) {
            return NextResponse.json(
                {message : 'Tous les champs sont requis pour l\'envoi des données'},
                {status:400}
            )
        } else {
            console.log('vérification des données reussi', name, email, mealDate); 
            
        }

        const newMeal = await prisma.meal.create({
            data: {
                name, 
                mealDate: new Date(mealDate),
                email, 
                
                
            }
        })
        return NextResponse.json(newMeal, { status: 201 });
    } catch (error) {
        console.error('Erreur lors de l\'envoi du repas')
                return NextResponse.json(
                    {message: 'Erreur lors de l\'envoi du repas'},
                    {status:500}
                )
    }
}