'use client'

import './addMember.scss'
import { useRouter } from "next/navigation";
import { FormEventHandler, useRef, useState } from "react";
import { imgStore, userStore } from "../store/store";
import axios from 'axios';
import { familyImage } from '@prisma/client';


export default function AddMember () {

    const router = useRouter()
    const inputFileRef = useRef<HTMLInputElement>(null);
    const userData = userStore.getState()
    const imageData = imgStore.getState()
    const [name, setName] = useState('')
    const [firstName, setFirstName] = useState('')
    // Encoder l'image en base64

  const uploadImage: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
  
    // Vérification qu'un fichier est sélectionné
    if (!inputFileRef.current?.files) {
      throw new Error("No file selected");
    }
  
    const file: File = inputFileRef.current.files[0];
    console.log('File',file);
    const mimeType = file.type;
    
   
    try {
      // Fonction pour encoder l'image en Base64
      const encodeImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result);
          };
  
          reader.onerror = (error) => {
            reject(error);
          };
  
          reader.readAsDataURL(file);
        
          
        });
      };
  
      // Encoder l'image en Base64
      const base64 = await encodeImageToBase64(file);     
          
  
      // Données supplémentaires pour Prisma
      const email = userData.email     
      
      // Maintenant qu'on a toutes nos Info on envoi a l'API
      const response = await axios.post("/api/uploadImage", {
        email:userData.email,
        base64: base64,
        name: name,
        firstName: firstName,
        mimeType: mimeType
      });
      console.log(response);
      
      const data = await response.data as familyImage;

      //On vide le formulaire au submit si l'upload à reussi
      
      if(data) {
        const  uploadSucceed = document.querySelector('.uploadSucceed') as HTMLInputElement
        const formReset = document.querySelector('.form') as HTMLFormElement
        

        if(!uploadSucceed){
          console.error('div uploadSucceed ou formulaire introuvable')
        } else{
          uploadSucceed.innerHTML='Ajout Réussi'
        }
        if(formReset) {
          formReset.reset()
        }
        return
      }
    } catch (error) {
      console.error("Erreur :", error);
    }    
  };   
  const home = () => {
    router.push('/home')
  }
  


    return(
        <div className='all'>
          <div className='title'>
            <h1>Ajouter un membre a la famille</h1>
          </div>
        <form className='form' onSubmit={uploadImage} >
            <input className='firstName' type="text" placeholder='Nom'  
            onChange={(event)=> {
                setName(event.currentTarget.value)
            }} />
            <input className='nameInput' type="text" placeholder='Prénom'  
            onChange={(event)=> setFirstName(event.currentTarget.value)} />
            <input className='file'  ref={inputFileRef} type="file"/>
            <button type='submit'>Valider</button>
            <button onClick={home}>Accueil</button>
            <div className='uploadSucceed'></div>      
        </form>
        </div>
    )
}