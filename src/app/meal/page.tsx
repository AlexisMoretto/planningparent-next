"use client";

import "./meal.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import ClientLayout from "../ClientLayout";
import axios from "axios";
import { userStore } from "../store/store";
import { Meal } from "@prisma/client";

// Définition du type pour les événements
interface FrontMeal {
  title: string;
  start: string; // Date/heure au format ISO
}

export default function MealPage() {
  const userData = userStore.getState()
  const [showModalAddMeal, setShowModalAddMeal] = useState<boolean>(false);
  const [showModalDeleteMeal, setShowModalDeleteMeal] = useState<boolean>(false);
  const [mealName, setMealName] = useState<string>(""); 
  const [clickedDate, setClickedDate] = useState<string>(""); // Date cliquée (ex : "2025-01-20")

  // Liste des événements, typée comme un tableau d'objets Meal
  const [meals, setMeals] = useState<FrontMeal[]>([]); 
  const [selectedMeal, setSelectedMeal] = useState<any>(null); // Pour garder une référence à l'événement cliqué

  const handleDateClick = (info: any) => {

    
    const selectedDate = info.date.toLocaleDateString('fr-CA'); // Extrait uniquement la date au format "YYYY-MM-DD"
    setClickedDate(selectedDate); // Stocke la date cliquée
    setShowModalAddMeal(true); // Affiche la modal
  };

  const addMeal = async () => {
    if (mealName) {
      const newMeal = {
        title: mealName,
        start: `${clickedDate}T00:00:00`, // Heure complète au format ISO
      };
      
      
      try {
        console.log('Donnée à envoyer: Email', userData.email, 'mealName:', mealName,'mealDate :', clickedDate, );
        
        const response: {data: Meal} = await axios.post('/api/uploadMeal', {
          name:mealName,
          mealDate:clickedDate,
          email:userData.email
        })
        const mealFromBDD:Meal = response.data
        console.log('mealFromBDD', mealFromBDD);
                
      } catch (error: any) {
        console.error('Erreur lors de l\'envoi de l\'événement :', error.response?.data || error.message);
      }
      
      setMeals([...meals, newMeal]); // Ajoute le nouvel événement
      setMealName("");
      setShowModalAddMeal(false); // Ferme la modal
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };

  const handleKeyDownValidate = (e: any) => {
    if (e.key === "Enter") {
      addMeal();
    }
  };

  const handleCancel = () => {  
    setShowModalDeleteMeal(false);
    setShowModalAddMeal(false)
  };

  const handleMealClick = (clickInfo: any) => {
    setSelectedMeal(clickInfo); // Stocke l'événement cliqué dans selectedMeal
    setShowModalDeleteMeal(true); // Affiche la modal de suppression
  };

  const deleteMeal = async (mealTitle: string) => {
    try {
      const response = await axios.delete('/api/deleteMeal', {
        data: { email: userData.email, name: mealTitle }
      });
  
      console.log("Repas supprimé:", response.data);
  
      // Mettre à jour l'état des repas
      setMeals((prevMeals) =>
        prevMeals.filter((meal) => meal.title !== mealTitle)
      );
  
      setShowModalDeleteMeal(false);
      setSelectedMeal(null);
    } catch (error) {
      console.error("Erreur lors de la suppression du repas", error);
    }
  };
  const fetchMeal = async () => {
    try {
      const response :{data:Meal[]} = await axios.get('/api/downloadMeal', {
        params: {email:userData.email},
      })
      const mealFetched: Meal[] = response.data
      console.log("MealFetched", mealFetched);
      
      setMeals(
        mealFetched.map((event) => ({
          title:event.name,
          start: `${event.mealDate}`,
        }))
      )
      console.log("État Meals après setMeals :", meals);
      console.log("Événements affichés dans FullCalendar :", meals);

    } catch (error) {
      console.error('Erreur lors de la récupération des événement');
      
    }
  }
  useEffect(() => {
    fetchMeal()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <ClientLayout>
      <div className="main">
        <div className="mainTitle">
          <h1>Repas</h1>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          dateClick={handleDateClick}
          events={meals}
          eventClick={handleMealClick}
        />
        {showModalAddMeal && (
          <div className="addEventModal">
            <div className="modalTitle">Ajouter un repas</div>
            <div className="addEventNameInput">
              <input
                type="text"
                placeholder="Nom du repas"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
              />
              <button type="submit" onClick={addMeal}>
                Valider
              </button>
              <button onClick={handleCancel}>Annuler</button>
            </div>
          </div>
        )}
        {showModalDeleteMeal && (
          <div className="deleteEventModal">
            <div className="modalTitle">
              Voulez-vous supprimer l&apos;évènement &quot;{selectedMeal?.event.title}&quot; ?
            </div>
            <div className="deleteEventButton">
              <button onClick={() => deleteMeal(selectedMeal?.event.title)}>Supprimer le repas</button>
              <button onClick={handleCancel}>Annuler</button>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
