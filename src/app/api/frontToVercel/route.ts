import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getActionChangeImgData } from 'src/app/actions/actions';
import { imgStore } from 'src/app/store/store';
import { storeInDB } from './storeInDB';

export async function POST(request: Request): Promise<NextResponse> {

   // Extraire les données du formulaire et on récupère le fichier sous forme de blob
   const formData = await request.formData();
   const file = formData.get('file') as Blob;
   // On vérifie que file existe
   if (!file) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  // Envoi du fichier au blob storage
  // Convertir le Blob en ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();  
  try {
    const blob = await put(filename, Buffer.from(arrayBuffer), {
      access: 'public',
    });
    console.log('blob', blob);

    
    await storeInDB(blob.url );
    return NextResponse.json(blob);
  } catch (error) {
    return NextResponse.json({message:'Vercel à un souci Bwo'})
    
  }
  
 

  

}