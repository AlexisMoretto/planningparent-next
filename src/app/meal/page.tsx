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
import { addMeal, deleteMeal, fetchMeal } from "src/utils/apiFunctions";

// Définition du type pour les événements
interface FrontMeal  {
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

  const handleAddMeal = () => {
    addMeal (userData.email, mealName,clickedDate,setMealName, meals, setMeals, setShowModalAddMeal)
  }

  const handleKeyDownValidate = (e: any) => {
    if (e.key === "Enter") {
      handleAddMeal();
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

  const handleDeleteMeal =  (mealTitle:string) => {
    deleteMeal(userData, mealName, mealTitle, setMeals, setShowModalDeleteMeal,setSelectedMeal)
  }
  
  useEffect(() => {
    fetchMeal(userData.email, setMeals, meals)
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
              <button type="submit" onClick={handleAddMeal}>
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
              <button onClick={() => handleDeleteMeal(selectedMeal?.event.title)}>Supprimer le repas</button>
              <button onClick={handleCancel}>Annuler</button>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
