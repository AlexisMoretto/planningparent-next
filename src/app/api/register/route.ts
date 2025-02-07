import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { NextRequest, NextResponse } from 'next/server';

const prisma: PrismaClient = new PrismaClient();

export async function POST(req: NextRequest, res: NextResponse) {
  if (req.method === 'POST') {
    try {
    const { email, password, name, firstName } : {email:string, password: string, name: string, firstName: string} = await req.json()
    //Vérifier si l'email et le password sont fourni

    if (!email || !password || !name|| !firstName) {
        return NextResponse.json({message : "Elément manquant"})
    } 
    // Fonction asynchrone pour générer le salt et le mdp
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(password, salt)

      const newUser: User = await prisma.user.create({
        data: {
          name: name,
          firstName: firstName,
          email: email,
          password: hashedPassword          
        },
      });
      return NextResponse.json(newUser, {status: 201});
    } catch (error: any) {
      console.error('Prisma error:', error);
      return NextResponse.json({ message: 'User creation failed', error: error.message }, {status: 500});
    }
  } else {
    return NextResponse.json({ message: 'Method is not allowed' }, {status: 405});
}
}