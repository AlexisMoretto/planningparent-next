/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import './Home.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { imgStore, userStore } from '../store/store';
import { useEffect, useState } from 'react';
import { Event, familyImage, Task } from '@prisma/client';
import ClientLayout from '../ClientLayout';
import Image from 'next/image';
import checkMark from "../../../public/checkMark.svg"
export default function Home() {

  const router = useRouter();
  const userData = userStore.getState()
  const imageData = imgStore.getState()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalName, setModalName] = useState<string>('')
  const [taskName, setTaskName] = useState<string>('')
  const [inputTask, setInputTask] = useState<boolean>(false)
  const [task, setTask] = useState<{taskName: string;}[]>()
  const [event, setEvent] = useState<Event[]>()
  

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
    
  useEffect(()=> {
    fetchImages()
  }),[]
  const addTask = async () => {

    try {

      console.log("Donnée à envoyer:",'email:', userData.email, "TaskName:", taskName, "modalName:", modalName);
      const response = await axios.post('api/uploadTask', {
        taskName: taskName,
        email: userData.email,
        nameConcerned: modalName,
      })
      console.log("response de l'upload de Task:", response.data);
      setTaskName('');
      fetchTask()
    } catch (error) {
      console.error("Erreur lors de l'envoi de task, vérifie que tout les éléments sont envoyés")
    }
  }
  const deleteTask = async (taskName: string)=> {
    try {
      
      const response = await axios.delete('api/deleteTask', {
        data: {
          email: userData.email, 
          taskName: taskName,
          nameConcerned: modalName
        }
      })
      console.log("Tache supprimé");
      fetchTask()
    } catch (error) {
      
    }
  }
  const fetchTask = async () => {

    console.log("Fetch des taches lancé");
    

    try {
      const response = await axios.get('api/downloadTask',
        {params: 
          {email:userData.email,
            nameConcerned:modalName,
          }
        }
       )
       const fetchedTask = response.data
       console.log("fetchedTask:" , fetchedTask);
       setTask(fetchedTask.map((taskParam: {taskName:string}) => ({
        taskName : taskParam.taskName
       })))
    } catch (error) {
      
    }
  };
  const fetchEvent = async () => {
    try {
      const response = await axios.get('api/downloadEventHome',{
        params: {
          nameConcerned:modalName,
          email: userData.email
        }
        
      })
      const eventFetched = response.data
      setEvent(
        eventFetched.map((event:Event) => ({
          eventName:event.eventName,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
        }))
      )
    } catch (error) {
      console.error("erreur lors de la récupération des evts");
      
    }
  }

  useEffect(() => {
    if (modalName) {
      console.log("modalName mis à jour :", modalName);
      fetchTask();
      fetchEvent();
    }
  }, [modalName]);
  
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
            <div className='taskAndButton'>
            <p>Tache</p>
            <button onClick={() => setInputTask(true)} >+</button>
            </div>
            {
              inputTask && (
                <div className='addTask'>
                  <div className='addTaskInput'>
                <input type="text"
                className='inputTask'
                placeholder='Tache à ajouter'
                onChange={(e) => setTaskName(e.target.value)}/>
                 </div>
                 <div className='addTaskButtonV'>
                 <button onClick={addTask} ><Image className='checkMark' src= {checkMark} alt='' /></button> 
                 </div> 
                 <div className='addTaskButtonX'>
                 <button onClick={() => setInputTask(false)}>X</button>
                 </div>
                 
                 </div>
              )
            }
            {task && task.map((t, index) => (
                    <div className='taskDisplayed' key={index}>
                      <p>{t.taskName}</p>
                      <button onClick={() => deleteTask(t.taskName)} >X</button>
                    </div>
                      )
                    )
                  }             
            <div className='event'>
              <p>Evenement</p>
             {event && event.map((e, index) => (
                <div className='eventDisplayed' key={index}>
                  <p>
                  {e.eventName} - {new Date(e.eventDate).toLocaleDateString()} - {(e.eventTime)}
                  </p>

                </div>
             ))}     
            </div>
          </div>
        </div>
        </div>
      )}
    </div>  
    </ClientLayout>
  );
}
