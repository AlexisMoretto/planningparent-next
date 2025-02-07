import { Meal,  PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma: PrismaClient = new PrismaClient;

export async function DELETE(request:Request) {

    const body: Meal = await request.json();
    const {name, email}: Meal = body

    if (!email && !name) {
        console.log('email,name', email, name);
        
        return NextResponse.json(
            {message: "Email et raison requis"},
            {status:400}
        )
    }
    try {

        const deleteExpense: {count:number} = await prisma.meal.deleteMany({
            where: {
                name,
                email:email,

            }
        })
        return NextResponse.json(
            { message: "Repas supprimée avec succès" }
        );
        
    } catch (error) {
        console.error("Erreur lors de la suppression du repas coté back")
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
    const email: string = searchParams.get('email') as string

    if(!email) {
        return NextResponse.json(
            {message : 'Email required'},
            {status: 400 }
        )
    }
    try {
        const meals: Meal[] = await prisma.meal.findMany({
            where:{
                email:email
            }
        })
        return NextResponse.json(meals, {status:200})
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

        const body : Meal= await req.json();

        const {name, mealDate, email } : Meal= body
        console.log("Body reçu dans la requête :", body);

        if(!name||!email||!mealDate) {
            return NextResponse.json(
                {message : 'Tous les champs sont requis pour l\'envoi des données'},
                {status:400}
            )
        } else {
            console.log('vérification des données reussi', name, email, mealDate); 
            
        }

        const newMeal: Meal = await prisma.meal.create({
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