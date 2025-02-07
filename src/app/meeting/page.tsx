"use client";

import "./meeting.scss";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import ClientLayout from "../ClientLayout";
import axios from "axios";
import { userStore } from "../store/store";
import { Event, User } from "@prisma/client";
import { addEvent, deleteEvent, fetchEvent } from "src/utils/apiFunctions";

// Définition du type pour les événements
interface FrontEvent {
  title: string;
  start: string; // Date/heure au format ISO
}

export default function Meeting() {
  const userData: User = userStore.getState()
  const [showModalAddEvent, setShowModalAddEvent] = useState<boolean>(false);
  const [showModalDeleteEvent, setShowModalDeleteEvent] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>(""); 
  const [eventTime, setEventTime] = useState<string>("");
  const [clickedDate, setClickedDate] = useState<string>(""); // Date cliquée (ex : "2025-01-20")
  const [nameConcerned, setNameConcerned] = useState<string>('')

  // Liste des événements, typée comme un tableau d'objets Event
  const [events, setEvents] = useState<FrontEvent[]>([]); 
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // Pour garder une référence à l'événement cliqué

  const handleDateClick:(info:any) => void = (info) => {

    
    const selectedDate: string = info.date.toLocaleDateString('fr-CA');
 // Extrait uniquement la date au format "YYYY-MM-DD"
    setClickedDate(selectedDate); // Stocke la date cliquée
    setShowModalAddEvent(true); // Affiche la modal
  };

  const handleAddEvent:() => void = () => {
    addEvent(userData.email, eventName,eventTime, events, clickedDate,nameConcerned,setEvents, setEventName,setEventTime, setShowModalAddEvent)
  }

  const handleKeyDownValidate: (e:any) => void = (e) => {
    if (e.key === "Enter") {
      handleAddEvent();
    }
  };

  const handleCancel:() => void = () => {  
    setShowModalDeleteEvent(false);
    setShowModalAddEvent(false)
  };

  const handleEventClick:(clickInfo:any) => void = (clickInfo) => {
    console.log("Événement cliqué :", clickInfo);

    setSelectedEvent(clickInfo); // Stocke l'événement cliqué dans selectedEvent
    setEventName(clickInfo.event.title);
    setNameConcerned(clickInfo.event.extendedProps?.nameConcerned || '')
    setShowModalDeleteEvent(true); // Affiche la modal de suppression
  };

  const handleDeleteEvent:() => void = () => {
    deleteEvent(userData.email, eventName, nameConcerned,setEvents, selectedEvent,setShowModalDeleteEvent, setSelectedEvent,)
  }
  
  useEffect(() => {
    fetchEvent(userData.email, setEvents,events)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <ClientLayout>
      <div className="main">
        <div className="mainTitle">
          <h1>Rendez-vous</h1>
        </div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          dateClick={handleDateClick}
          events={events}
          eventClick={handleEventClick}
        />
        {showModalAddEvent && (
          <div className="addEventModal">
            <div className="modalTitle">Ajouter un événement</div>
            <div className="addEventNameInput">
              <input
                type="text"
                placeholder="Nom de l'évènement"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <input
                type="time"
                placeholder="Heure"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                onKeyDown={handleKeyDownValidate}
              />
              <input type="text"
              placeholder="Personne concerné"
              onChange={(e) => setNameConcerned(e.target.value)}
               />
              <button type="submit" onClick={handleAddEvent}>
                Valider
              </button>
              <button onClick={handleCancel}>Annuler</button>
            </div>
          </div>
        )}
        {showModalDeleteEvent && (
          <div className="deleteEventModal">
            <div className="modalTitle">
              Voulez-vous supprimer l&apos;évènement &quot;{selectedEvent?.event.title}&quot; ?
            </div>
            <div className="deleteEventButton">
              <button onClick={() => handleDeleteEvent()}>Supprimer l&apos;événement</button>
              <button onClick={handleCancel}>Annuler</button>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
