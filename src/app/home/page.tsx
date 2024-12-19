/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import './Home.scss';
import { useState, FormEventHandler, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { imgStore, userStore } from '../store/store';
import { Img } from '../@types';
import type { PutBlobResult } from '@vercel/blob';
import { blob } from 'stream/consumers';
import { NextResponse } from 'next/server';
import { getActionChangeImgData } from '../actions/actions';
import { resolve } from 'path';
import { rejects } from 'assert';
import { headers } from 'next/headers';



export default function Home() {

  const inputFileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const userData = userStore.getState()
  const imageData = imgStore.getState()

  // Encoder l'image en base64

  const uploadImage: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  
    // Vérification qu'un fichier est sélectionné
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }
  
    const file = inputFileRef.current.files[0];
    console.log('File',file);
    
  
    try {
      // Fonction pour encoder l'image en Base64
      const encodeImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
  
          reader.onload = () => {
            const result = reader.result as string;
            // Supprime le préfixe 'data:image/jpeg;base64,'
            resolve(result.split(",")[1]); 
          };
  
          reader.onerror = (error) => {
            reject(error);
          };
  
          reader.readAsDataURL(file);
        });
      };
  
      // Encoder l'image en Base64
      const base64Image = await encodeImageToBase64(file);
      console.log('base64Image',base64Image);
      
  
      // Données supplémentaires pour Prisma
      const email = userData.email
      const name = userData.nom
      const firstName = userData.prenom
      console.log("Userdata a envoyer avec le file",email, name, firstName);
      
      
      // Maintenant qu'on a toutes nos Info on envoi a l'API
      const response = await axios.post("/api/upload", {
        email,
        base64: base64Image,
        name,
        firstName,
      });
  
      const data = await response.data;
      console.log("Réponse du backend :", data);
    } catch (error) {
      console.error("Erreur :", error);
    }
  };
   const actionChangeImageData = getActionChangeImgData(imageData)
   imgStore.dispatch(actionChangeImageData)   


  const verifyoken = async (token: any) => {
    try {
      
      const response = await axios.post(
        '/api/verify-token', 
        {token}, 
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
      
      console.log('/api/verify-token',response);
      
      
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      router.push('/login');
    }
  }; 
  
  return (
    <div className="home">
      <h1>Famille de {userData.nom} </h1>
      <div className='allTree'>
        <div className='titleTree'>
        <h2>Membre de la famille</h2>
        </div>
        <div className='tree'>
          <form onSubmit={uploadImage}>
            <input type="file" ref={inputFileRef} name='file' required />
            <button type='submit'>Upload</button>
          </form>
          {/* affichage de l'image conditionnel */}
          {imageData.base64 ? (<img src={imageData.base64} alt='' />)  : "Pas d'url"}
          
        </div>
      </div>
    </div>  
  );
}
