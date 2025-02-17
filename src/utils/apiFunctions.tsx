import { Budget, Meal, Event, Shopping, User, Expense, familyImage } from "@prisma/client";
import axios from "axios";
import router from "next/router";
import { SetStateAction } from "react";
import { getActionChangeUserData } from "src/app/actions/actions";

import { userStore } from "src/app/store/store";


const userData: User = userStore.getState();


// --------------BUDGET----------------
// Onn créer un budget ou on le met a jour
export const validateAmountBudget: (
  budgetAmount: number,
    email:string,
    setShowInputbudgetAmount:(value:boolean) => void,
    setBudgetAmount: (budgetAmount:number) => void
) => void = async (
    budgetAmount,
    email,
    setShowInputbudgetAmount,
    setBudgetAmount
    ) => {

    setShowInputbudgetAmount(false);
    try { 
      const response: {data:Budget} = await axios.post('/api/budget', {
        budget: budgetAmount,
        email: userData.email,
      });
      console.log('Response from /api/budget', response.data);
      setBudgetAmount(budgetAmount)
    } catch (error) {
      console.error("Erreur lors de l'envoi du Budget Prévu");
    }
  };

// Récuperer le budget de la BDD
  export const fetchBudgetAmount : (
    email:string,
    setBudgetAmount:(budget:number) => void
  )=> void = async (
    email,
    setBudgetAmount
) => {
        try {
          const response: {data: Budget} = await axios.get('/api/budget', {
            params: { email },
          });
          const fetchedBudget: Budget = response.data;
          console.log('fetchedBudget', fetchedBudget);
          setBudgetAmount(fetchedBudget.budget);
        } catch (error) {
          console.error("Erreur lors de la récupération du budget");
        }
      };
      // ---------DEPENSE------------------

      // Ajouter une dépense en BDD


      export const validateExpense: (
        expense: number,
        reason: string,
        email: string,
        setExpenses: React.Dispatch<React.SetStateAction<{ reason: string; amount: number }[]>>,
        setExpense: React.Dispatch<React.SetStateAction<number>>,
        setReason: (reason: string) => void,
        setShowExpenseInput: (value: boolean) => void
      ) => void = async (
        expense,
        reason,
        email,
        setExpenses,
        setExpense,
        setReason,
        setShowExpenseInput,
        
    ) => {

        if (expense > 0  && reason.trim()!=='') {
          const newExpense = { reason, amount: expense };
    
          try {
            const response:{data: Expense} = await axios.post('/api/expense', {
              expense,
              reason,
              email,
            });
            console.log('UploadedExpense', response.data);
    
            // Mise à jour de la liste des dépenses
            setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
          } catch (error) {
            console.error("Erreur lors de l'envoi des dépenses");
          }
    
          setReason("");
          setExpense(0);
          setShowExpenseInput(false);
          fetchExpense(email, setExpenses)
        }
      };

      // Suppression d'une dépense
  export const deleteExpense = async (
    reasonToDelete: string,
    email:string,
    setExpenses:React.Dispatch<React.SetStateAction<{reason:string, amount:number}[]>>
) => {
    try {
      const response: {data:Expense} = await axios.delete('/api/expense', {
        data: { email, reason: reasonToDelete },
      });
      console.log('Dépense supprimée :', response.data);

      // Mise à jour des dépenses après suppression
      setExpenses(prevExpenses => prevExpenses.filter(exp => exp.reason !== reasonToDelete));
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense", error);
    }
  };
  // Récupération des dépensnes
 export const fetchExpense: (
  email:string,
    setExpenses:React.Dispatch<React.SetStateAction<{reason:string, amount:number}[]>>
 ) => void =  async (
    email,
    setExpenses,
 ) => {
        try {
          const response: {data:Expense[]} = await axios.get('/api/expense', {
            params: { email },
          });
          const expensesFetched: Expense[] = response.data;
          setExpenses(expensesFetched.map((exp: { reason: any; expense: any; }) => ({ reason: exp.reason, amount: exp.expense })));
        } catch (error) {
          console.error('Erreur lors de la récupération des dépenses', error);
        }
      };

      // --------------- LOGIN ----------------

      export const handleSubmit: (
        email:string,
        password:string,
      )=> void  = async (
        email,
        password,
        
      ) => {
        
        try {
           const response = await axios.post('/api/login', {email, password})
           console.log('email, password au login',email,password);
           
           console.log('response from loginRoute', response);
           
           
            // localStorage.setItem('token', response.data.token);

            console.log( 'Response from API/login',response);
            
            // On envoi l'action au store pour qu'il le voit et qu'il l'execute le reducer
            const actionChangeUserData = getActionChangeUserData(response.data.user)
            
            userStore.dispatch(actionChangeUserData)

        

            

            
        } catch (error) { console.error('Login Failed', error);
              
        }
    }

// -----------------MEAL-------------------------------------------
//-------------------------------MEAL----------------------------------


// Ajouter un repas
export const addMeal: (
  email:string,
  mealName: string,
  clickedDate:string,
  setMealName:(value:string) => void,
  meals: {title:string, start:string}[],
  setMeals: React.Dispatch<React.SetStateAction<{title:string, start:string}[]>>,
  setShowModalAddMeal:(value:boolean) => void,
)=> void = async (
  email,
  mealName,
  clickedDate,
  setMealName,
  meals,
  setMeals,
  setShowModalAddMeal,
) => {
  if (mealName) {
    const newMeal = {
      title: mealName as string,
      start: `${clickedDate}T00:00:00` as string, // Heure complète au format ISO
    };
    
    
    try {
      console.log('Donnée à envoyer: Email', userData.email, 'mealName:', mealName,'mealDate :', clickedDate, );
      
      const response: {data: Meal} = await axios.post('/api/meal', {
        name:mealName,
        mealDate:clickedDate,
        email,
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

// Supprimer un repas 

 export const deleteMeal: (
  email: string,
  meal:string,
  mealTitle: string,
  setMeals:React.Dispatch<React.SetStateAction<{title:string, start:string}[]>>,
  setShowModalDeleteMeal:(value:boolean) => void,
  setSelectedMeal:(value:null) => void,
 ) => void = async (
  email,
  meal,
  mealTitle,
  setMeals,
  setShowModalDeleteMeal,
  setSelectedMeal,
) => {
  try {
    const response: {data:Meal} = await axios.delete('/api/meal', {
      data: { email, name: mealTitle }
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

// Récupération des repas 
export const fetchMeal: (
  email:string,
  setMeals: React.Dispatch<React.SetStateAction<{title:string, start:string}[]>>,
  meals:{title:string, start:string}[],
) => void = async (
  email,
  setMeals,
  meals,
) => {
  try {
    const response :{data:Meal[]} = await axios.get('/api/meal', {
      params: { email },
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

// --------------MEETING------------

export const addEvent: (
  email:string,
  eventName: string,
  eventTime: string,
  events:{title:string, start:string}[],
  clickedDate:string,
  nameConcerned: string,
  setEvents: React.Dispatch<React.SetStateAction<{title:string, start:string}[]>>,
  setEventName:(value:string) => void,
  setEventTime: (value:string) => void,
  setShowModalAddEvent: (value: boolean) => void,
) => void = async (
  email,
  eventName,
  eventTime,
  events,
  clickedDate,
  nameConcerned,
  setEvents,
  setEventName,
  setEventTime,
  setShowModalAddEvent,

) => {
  if (eventName && eventTime) {
    const newEvent = {
      title: eventName as string,
      start: `${clickedDate}T${eventTime}:00` as string, // Format ISO requis par FullCalendar
    };
    
    
    try {
      console.log('Donnée à envoyer: Email', userData.email, 'eventName:', eventName,'eventDate :', clickedDate, 'EventTime:',eventTime);
      
      const response: {data: Event} = await axios.post('/api/event', {
        eventName,
        eventTime,
        eventDate:clickedDate,
        email,
        nameConcerned,
      })
      const eventFromBDD:Event = response.data
      console.log('eventFromBDD', eventFromBDD);
              
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'événement :', error.response?.data || error.message);
    }
    
    setEvents([...events, newEvent]);
    setEventName("");
    setEventTime("");
    setShowModalAddEvent(false);
  } else {
    alert("Veuillez remplir tous les champs.");
  }
};
// Suppression des evts

export const deleteEvent: (
  email:string,
  eventTitle:string,
  nameConcerned:string,
  setEvents: React.Dispatch<React.SetStateAction<{title:string, start:string}[]>>,
  selectedEvent:any,
  setShowModalDeleteEvent:(value:boolean) => void,
  setSelectedEvent:(value:any) => void,
) => void = async (
  email,
  eventTitle,
  nameConcerned,
  setEvents,
  selectedEvent,
  setShowModalDeleteEvent,
  setSelectedEvent,
) => {
  try {
    const response: {data:Event} = await axios.delete('/api/event', {
      data : {
        email,
        eventName:eventTitle,
        nameConcerned
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
// Fetch Event
export const fetchEvent: (
  email:string,
  setEvents:React.Dispatch<React.SetStateAction<{title:string, start: string}[]>>,
  events: {title:string, start:string}[],
) => void = async (
  email,
  setEvents,
  events,


) => {
  try {
    const response :{data:Event[]} = await axios.get('/api/event', {
      params: {email},
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
//-----------SHOPPING--------------------

export const deleteArticle: (
  name:string,
  email:string
) => void = async (
  name,
  email,
) => {

  console.log("Article supprimé", name);

  try {
      const response: {count:number} = await axios.delete('api/shopping', {
          data: {
              email, 
              name:name
          }
      });
      
      
  } catch (error) {
      console.error("Erreur lors de la suppression de l'article");
      
  }
}

export const fetchShoppingList: (
  email: string,
  setList: React.Dispatch<React.SetStateAction<{ name: string }[]>>,
) => void = async (
  email,
  setList,
) => {
                        
        try {
            const response: {data: Shopping[]} = await axios.get('api/shopping',{
                params: {email},
            });
            const itemFetched: Shopping[] = response.data
            console.log('Liste de courses',itemFetched);
            
            // On met ensuite a jour l'état de la liste des articles et on les déstructures avec comme couple clé/valeur,
            setList(itemFetched.map(article => ({
                name:article.name
            })))
            
            

        } catch (error) {
            console.error('Erreur lors de la récupération de la liste: Email manquant')
        }
    }

export const addItem: (
  email:string,
  name:string,
) => void = async (
  email,
  name,
) => {

        try {
            const response: {data:Shopping} = await axios.post('api/shopping', {
              name:name, 
              email,
               
            })
            console.log("Article ajouté en BDD",response.data);
                        
        } catch (error) {
            console.log("Erreur lors de l'envoi de l'article");
            
        }
        
        
    }

    // ---------------------- HOME ------------------------------

    export const deletePeople: (
      email:string,
      name:string,
      setDeletePeopleModal: (value: boolean) => void,

    ) => void = async (
      email,
      name,
    
      setDeletePeopleModal,
    ) => {    
        try {
          console.log("🛠️ Envoi de la requête DELETE avec :", { email, name });
          const response: {data:familyImage} = await axios.delete("/api/image", {
            data: {
              email,
              name:name,
            
            }
            
          })
          console.log("✅ Suppression réussie :", response.data);
          setDeletePeopleModal(false)
          
          
        } catch (error) {
          console.error("Erreur lors de la suppression de la personnne")
        }
      }