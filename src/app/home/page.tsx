/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import './Home.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { imgStore, userStore } from '../store/store';
import { useEffect } from 'react';
import { familyImage } from '@prisma/client';

export default function Home() {

  const router = useRouter();
  const userData = userStore.getState()
  const imageData = imgStore.getState()
  

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
  const fetchImages = async () => {
    // Vider le contenu de la div principale
    const membersContainer = document.querySelector('.membersContainer') as HTMLElement;
    if (membersContainer) {
      membersContainer.innerHTML = '';
    } else {
      console.error('La div .membersContainer est introuvable dans le DOM');
      return;
    }
  
    try {
      const response: { data: familyImage[] } = await axios.get('/api/downloadImage', {
        params: { email: userData.email },
      });
  
      const imagesFromBDD = response.data as familyImage[];
      console.log("Réponse de l'API stockée dans imagesFromBDD", imagesFromBDD);
  
      // Créer une div par membre et ajouter le contenu
      imagesFromBDD.forEach((imageFromBDD: familyImage) => {
        // Conteneur parent pour chaque membre
        const memberDiv = document.createElement('div') as HTMLElement;
        memberDiv.classList.add('member');
  
        
        const imgButton = document.createElement('button') as HTMLButtonElement;
        imgButton.classList.add('imgButton');
        imgButton.type = 'button'; // Type bouton pour éviter le comportement par défaut
  
        const imgElement = document.createElement('img');
        imgElement.src = imageFromBDD.base64;
        imgElement.alt = `${imageFromBDD.firstName} ${imageFromBDD.name}`;
  
        // Ajouter une action au clic sur le bouton
        imgButton.onclick = () => {
          alert(`Vous avez cliqué sur ${imageFromBDD.firstName} ${imageFromBDD.name}`);
        };
  
        // Ajouter l'image au bouton
        imgButton.appendChild(imgElement);
  
        // Nom complet
        const nameElement = document.createElement('h2');
        nameElement.textContent = `${imageFromBDD.firstName} ${imageFromBDD.name}`;
  
        // Ajouter le bouton et le nom dans le conteneur membre
        memberDiv.appendChild(imgButton);
        memberDiv.appendChild(nameElement);
  
        // Ajouter le conteneur du membre dans la div principale
        membersContainer.appendChild(memberDiv);
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des images :", error);
    }
  };
  
  
console.log('userData du premier rendu', userData);

  // Route de la navBarre
    
  const addMember = () => {
    router.push('/addMember')
  }
  const goToBudget = () => {
    router.push('/budget')
  }
  const goToShopping = () => {
    router.push('/shopping')
  }
  const goToMeal = () => {
    router.push('/meal')
  }
  const goToMeeting = () => {
    router.push('/meeting')
  }  
  useEffect(()=> {
    fetchImages()
  }),[]
  
  return (
    <div className="home">
      <div className='navBarre'>
      <button className='addMember' type='button' onClick={addMember}>Ajouter un proche</button>
      <button className='addMember' type='button' onClick={goToBudget}>Budget</button>
      <button className='addMember' type='button' onClick={goToShopping}>Course</button>
      <button className='addMember' type='button' onClick={goToMeal}>Repas</button>
      <button className='addMember' type='button' onClick={goToMeeting}>Rendez-vous</button>
      <button onClick={fetchImages}>FetchImages</button>
      </div>
      <div className='title'><h1>Famille de {userData.name} </h1></div>
      <div className='allTree'>
        <div className='titleTree'>
        <h2>Membre de la famille</h2>
        </div>
        <div className='tree'>
        <div className='membersContainer'></div>
        </div>
      </div>
    </div>  
  );
}
