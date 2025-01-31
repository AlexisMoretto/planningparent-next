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
import { Event } from "@prisma/client";

// Définition du type pour les événements
interface FrontEvent {
  title: string;
  start: string; // Date/heure au format ISO
}

export default function Meeting() {
  const userData = userStore.getState()
  const [showModalAddEvent, setShowModalAddEvent] = useState<boolean>(false);
  const [showModalDeleteEvent, setShowModalDeleteEvent] = useState<boolean>(false);
  const [eventName, setEventName] = useState<string>(""); 
  const [eventTime, setEventTime] = useState<string>("");
  const [clickedDate, setClickedDate] = useState<string>(""); // Date cliquée (ex : "2025-01-20")
  const [nameConcerned, setNameConcerned] = useState<string>('')

  // Liste des événements, typée comme un tableau d'objets Event
  const [events, setEvents] = useState<FrontEvent[]>([]); 
  const [selectedEvent, setSelectedEvent] = useState<any>(null); // Pour garder une référence à l'événement cliqué

  const handleDateClick = (info: any) => {

    
    const selectedDate = info.date.toLocaleDateString('fr-CA');
 // Extrait uniquement la date au format "YYYY-MM-DD"
    setClickedDate(selectedDate); // Stocke la date cliquée
    setShowModalAddEvent(true); // Affiche la modal
  };

  const addEvent = async () => {
    if (eventName && eventTime) {
      const newEvent = {
        title: eventName,
        start: `${clickedDate}T${eventTime}:00`, // Format ISO requis par FullCalendar
      };
      
      
      try {
        console.log('Donnée à envoyer: Email', userData.email, 'eventName:', eventName,'eventDate :', clickedDate, 'EventTime:',eventTime);
        
        const response: {data: Event} = await axios.post('/api/uploadEvent', {
          eventName,
          eventTime,
          eventDate:clickedDate,
          email:userData.email,
          nameConcerned,
        })
        const eventFromBDD:Event = response.data
        console.log('eventFromBDD', eventFromBDD);
                
      } catch (error: any) {
        console.error('Erreur lors de l\'envoi de l\'événement :', error.response?.data || error.message);
      }
      
      setEvents([...events, newEvent]); // Ajoute le nouvel événement
      setEventName("");
      setEventTime("");
      setShowModalAddEvent(false); // Ferme la modal
    } else {
      alert("Veuillez remplir tous les champs.");
    }
  };

  const handleKeyDownValidate = (e: any) => {
    if (e.key === "Enter") {
      addEvent();
    }
  };

  const handleCancel = () => {  
    setShowModalDeleteEvent(false);
    setShowModalAddEvent(false)
  };

  const handleEventClick = (clickInfo: any) => {
    setSelectedEvent(clickInfo); // Stocke l'événement cliqué dans selectedEvent
    setShowModalDeleteEvent(true); // Affiche la modal de suppression
  };

  const deleteEvent = async (eventTitle: string) => {
    try {
      const response = await axios.delete('/api/deleteEvent', {
        data : {
          email: userData.email,
          eventName: eventTitle,
          nameConcerned:nameConcerned
        }
      })
      console.log("Evenement supprimé", response.data);
      
    } catch (error) {
      console.log("Erreur lors de la suppression de l'event", error);
      
    }
    
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.title !== eventTitle)
      );
      selectedEvent.event.remove();
      setShowModalDeleteEvent(false);
      setSelectedEvent(null);
    
  };
  const fetchEvent = async () => {
    try {
      const response :{data:Event[]} = await axios.get('/api/downloadEvent', {
        params: {email:userData.email},
      })
      const eventFetched: Event[] = response.data
      console.log("eventFetched", eventFetched);
      
      setEvents(
        eventFetched.map((event) => ({
          title:event.eventName,
          start: `${event.eventDate}`,
        }))
      )
      console.log("État events après setEvents :", events);
      console.log("Événements affichés dans FullCalendar :", events);

    } catch (error) {
      console.error('Erreur lors de la récupération des événement');
      
    }
  }
  useEffect(() => {
    fetchEvent()
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
              <button type="submit" onClick={addEvent}>
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
              <button onClick={() => deleteEvent(selectedEvent?.event.title)}>Supprimer l&apos;événement</button>
              <button onClick={handleCancel}>Annuler</button>
            </div>
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
