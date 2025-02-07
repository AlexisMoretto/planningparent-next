import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const token: string = req.headers.get('Authorization')?.replace('Bearer ', '') as string;
    const secret: string = process.env.JWT_SECRET as string;
if (!secret) {
  return NextResponse.json({ message: 'Secret JWT manquant dans les variables d\'environnement.' }, { status: 500 });
}

    if (!token) {
        return NextResponse.json({ message: 'Token manquant.' }, { status: 401 });
    }

    try {
        const decoded: string| JwtPayload = jwt.verify(token, secret); 
        
        return NextResponse.json({ message: 'Token valide.', user: decoded }, { status: 200 });
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            return NextResponse.json({ message: 'Token expiré.' }, { status: 401 });
        } else if (error.name === 'JsonWebTokenError') {
            return NextResponse.json({ message: 'Token invalide.' }, { status: 401 });
        } else {
            return NextResponse.json({ message: 'Erreur lors de la vérification du token.' }, { status: 500 });
        }
    }
    
}
