import { ACTIONS, User } from "../@types";



const userInitialState: User = {
    nom: 'name de l\'initialState',
    password: '',
    email: '',
    id: 0,
    prenom: "prenom de l\'initialState",
    token: ''
  };  

const userReducer = (state = userInitialState, action: {
  type: ACTIONS;
  payload: {
    nom: string;
    prenom: string;
    email: string
  }
}) => {

  //Si l'action recu est CHANGE_USER_DATA on return un state avec les valeur modifié

  if (action.type === ACTIONS.CHANGE_USER_DATA ) {
    // On crée un nouveau state dans lequel on deverse le state actuel et on modifie les valeurs en fonction de la réponse API
    return {
      ...state,      
        nom: action.payload.nom,
        prenom: action.payload.prenom,
        email: action.payload.email,
    }
  }
      // La valeur que le reducer return est automatiquement placé dans le state du store
      console.log('UserState', state);
      
    return state;
  }
export default userReducer
