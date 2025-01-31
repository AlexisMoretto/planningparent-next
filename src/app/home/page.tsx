/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import './Home.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { imgStore, userStore } from '../store/store';
import { useEffect, useState } from 'react';
import { familyImage, Task } from '@prisma/client';
import ClientLayout from '../ClientLayout';
import Image from 'next/image';
import checkMark from "../../../public/checkMark.svg"
export default function Home() {

  const router = useRouter();
  const userData = userStore.getState()
  const imageData = imgStore.getState()
  const [showModal, setShowModal] = useState<boolean>()
  const [modalName, setModalName] = useState<string>('')
  const [taskName, setTaskName] = useState<string>('')
  const [inputTask, setInputTask] = useState<boolean>(false)
  

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
          console.log('Image clické');
          
          // Il faut ouvrir une modal 
          setShowModal(true)
          setModalName(imageFromBDD.firstName)

         
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

  
  useEffect(()=> {
    fetchImages()
  }),[]
  const fetchSummary = async () => {
    try {
      const response: {data: Task} = await axios.get('api/summary', {
        params: {
          email: userData.email,
          nameConcerned:modalName,
          taskName,

        }
      } 
    )
    const summaryFetched = response.data
    console.log('summaryFetched', summaryFetched);
    
    } catch (error) {
      console.error("Erreur lors de la récupération des informations du back sur la personne");
      
    }
  }
  
  return (
    <ClientLayout>
    <div className="home">
      <div className='navBarre'>
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
      {showModal && (
        <div className='mainModal'>
        <div className='modalName'>          
          {modalName}
          <button onClick={()=> setShowModal(false)}>X</button>
        </div>
        <div className='summary'>
          <div className='task'>
            <p>Tache</p>
            <button onClick={() => setInputTask(true)} >+</button>
            {
              inputTask && (
                <div className='addTask'>
                  <div className='addTaskInput'>
                <input type="text"
                className='inputTask'
                placeholder='Tache à ajouter'
                 />
                 </div>
                 <div className='addTaskButtonV'>
                 <button><Image className='checkMark' src= {checkMark} alt='' /></button> 
                 </div> 
                 <div className='addTaskButtonX'>
                 <button onClick={() => setInputTask(false)}>X</button>
                 </div>
                                
                 </div>
              )
            }
            <div className='event'>
              <p>Evenement</p>
            </div>
          </div>
        </div>
        </div>
      )}
    </div>  
    </ClientLayout>
  );
}
