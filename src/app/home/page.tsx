/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import './Home.scss';
import { useState, FormEventHandler, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { uploadFile } from '../upload/upload.action';
import { getActionChangeImgData } from '../actions/actions';
import { imgStore, userStore } from '../store/store';
import { Img } from '../@types';
import type { PutBlobResult } from '@vercel/blob';
import { blob } from 'stream/consumers';
import { NextResponse } from 'next/server';



export default function Home() {

  const inputFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userData = userStore.getState()
  const imageData = imgStore.getState()

  const uploadImage: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    
    // Vérification qu'il y a bien un fichier séléctionné
    if(!inputFileRef.current?.files){
      return new Error('No file selected')
    }
    

    // stockage dans la variable file du fichier à uploader
    const file = inputFileRef.current.files[0];
    // Créer un objet FormData pour envoyer le fichier
  const formData = new FormData();
  formData.append('file', file);
    // Envoi au back des données concernant l'image séléctionné
    console.log(file);
    try {
      const response = await axios.post(`/api/frontToVercel`, {formData, fileName: file.name, email:userStore.getState().email}, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        },
      });
      // Stockage de la réponse dans newBlob result
    const newBlob = response.data.url as PutBlobResult
    console.log('newBlob', newBlob);
    // On stock ensuite l'url dans le state du store
    const actionChangeImgData = getActionChangeImgData(newBlob);
    imgStore.dispatch(actionChangeImgData)
    console.log('actionChangeImgData', actionChangeImgData);
    
      // On récupère l'url du store pour l'envoyer en DB
    if(newBlob) {

      const {url} = imgStore.getState() 
      console.log('url', url);
      
      try{
        const response = await axios.post('/api/image', url )
        
      } catch {
        return NextResponse.json({message: 'Image non enregistré'})
      }
    }
    } catch (error) {
      console.error("Upload failed", error);
    }
    
    


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
    } finally {
      setLoading(false);
    }
  }};
  
  

  if (loading) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="home">
      <h1>Famille de {userData.prenom} </h1>
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
          {imageData.url ? (<img src={imageData.url} alt='' />)  : "Pas d'url"}
          
        </div>
      </div>
    </div>  
  );
}
