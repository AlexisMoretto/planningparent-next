/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client';
import './Home.scss';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { imgStore, userStore } from '../store/store';
import { useEffect, useState } from 'react';
import { Event, familyImage, Task, User } from '@prisma/client';
import ClientLayout from '../ClientLayout';
import Image from 'next/image';
import checkMark from "../../../public/checkMark.svg"
import { deletePeople } from 'src/utils/apiFunctions';
import { profile } from 'console';
export default function Home() {

  const router = useRouter();
  const userData: User = userStore.getState()
  const imageData: familyImage = imgStore.getState()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [modalName, setModalName] = useState<string>('')
  const [taskName, setTaskName] = useState<string>('')
  const [inputTask, setInputTask] = useState<boolean>(false)
  const [task, setTask] = useState<{taskName: string;}[]>()
  const [event, setEvent] = useState<Event[]>()
  const [people, setPeople] = useState<familyImage[]>()
  const [deletePeopleModal, setDeletePeopleModal] = useState<boolean>()
  const [base64, setBase64] = useState<string>('')
  

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
    
    try {
      const response: { data: familyImage[] } = await axios.get('/api/image', {
        params: { email: userData.email },
      });
  
      const imagesFromBDD = response.data as familyImage[];
      console.log(imagesFromBDD);
      setPeople(imagesFromBDD)
    } catch (error) {
      console.error("Erreur lors de la récupération des images :", error);
    }
  };
  const addTask = async () => {

    try {

      console.log("Donnée à envoyer:",'email:', userData.email, "TaskName:", taskName, "modalName:", modalName);
      const response = await axios.post('api/task', {
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
      
      const response = await axios.delete('api/task', {
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
      const response = await axios.get('/api/task',
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
      const response = await axios.get('api/home',{
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
  useEffect(() => {
    fetchImages()
  },[])
  const handleDeletePeople: () => void = async () => {
    console.log("Suppression lancé")
    console.log('Nom de la modal',modalName);
    
    try {
        console.log("Suppression de :", userData.email, modalName);
         deletePeople(userData.email,modalName, setDeletePeopleModal);
    } catch (error) {
        console.error("Erreur dans handleDeletePeople :", error);
    }
};
  const goToAddMember = () => {
    router.push('addMember')
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
        <div className="membersContainer">
          {people && people.length > 0 ? (
            people.map((profil, index) => (
          <div key={index} className="memberCard">
            <button className='imgButton' onClick={() => {setModalName(profil.firstName)
              setBase64(profil.base64)
            }} ><img className='peopleImage' src={profil.base64} alt={profil.firstName} onClick={ () => {setShowModal(true)}} /></button>
            <p>{profil.firstName} {profil.name}</p>
      </div>
    ))
  ) : (
    <div className='noMember'>
    <p>Aucun membre trouvé.</p>
    <button onClick={goToAddMember}>Ajouter un membre à la famille</button>
    </div>
  )}
</div>
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
        <div className='deletePeople'>
          <button className='deletePeopleButton' onClick={()=> {setDeletePeopleModal(true)
            setModalName(modalName)}
          }>Supprimer de la famille</button>
          {deletePeopleModal && (
            <div className='deletePeopleModal'>
              <p>Etes vous sur de vouloir supprimer cette personne</p>
              <button onClick={handleDeletePeople}>Oui</button>
              <button onClick={() =>setDeletePeopleModal(false)}>Annuler</button>
            </div>
          )}
        </div>
        </div>
        
      )}
    </div>  
    </ClientLayout>
  );
}
