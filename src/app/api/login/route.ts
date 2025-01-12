import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userStore } from 'src/app/store/store';
import { getActionChangeUserData } from 'src/app/actions/actions';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        console.log('email, password', email, password);
        

        if (!email || !password) {
            return NextResponse.json({ message: 'Email et mot de passe requis.' }, { status: 400 });
        }

        // Recherche de l'utilisateur dans la base de données
        const user = await prisma.user.findUnique({
            where: { email },
          });
        
        
        // Vérification du mot de passe
        if (user && bcrypt.compareSync(password, user.password)) {
            if (!process.env.JWT_SECRET) {
                return NextResponse.json({ message: 'JWT_SECRET non défini.' }, { status: 500 });}
            const token = jwt.sign(
                { id: user.id, email: user.email, name:user.name, firstname: user.firstName },
                process.env.JWT_SECRET as string,
                { expiresIn: '1h' }
            );

            // Réponse avec le token et l'utilisateur
            return NextResponse.json({ token, user: user }, { status: 200 });
            
        } else {
            return NextResponse.json({ message: 'Email ou mot de passe incorrect.' }, { status: 401 });
        }
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        return NextResponse.json({ message: 'Erreur serveur.' }, { status: 500 });
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, { status: 200 });
}
