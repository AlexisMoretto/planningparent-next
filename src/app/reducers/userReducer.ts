import { User } from "@prisma/client";
import { ACTIONS } from "../@types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";



const initialState: User = {
  name: '',
    password: '',
    email: '',
    id: 0,
    firstName: "",
    token: ''
  };  

export const userReducer = (state = initialState, action: {
  type: ACTIONS;
  payload: {
    name: string;
    firstName: string;
    email: string
  }
}) => {

  //Si l'action recu est CHANGE_USER_DATA on return un state avec les valeur modifié

  if (action.type === ACTIONS.CHANGE_USER_DATA ) {
    // On crée un nouveau state dans lequel on deverse le state actuel et on modifie les valeurs en fonction de la réponse API
    return {
      ...state,      
      name: action.payload.name,
        firstName: action.payload.firstName,
        email: action.payload.email,
    }
  }
      // La valeur que le reducer return est automatiquement placé dans le state du store      
    return state;
  }



export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state,  action: PayloadAction<User>) => {
      const userDataSet = action.payload

      if (userDataSet) {
        state.email = userDataSet.email,
      state.firstName= userDataSet.firstName,
      state.id= userDataSet.id,
      state.name = userDataSet.name,
      state.password= userDataSet.password,
      state.token= userDataSet.token
      }
      
    }
    
  }
})
export const {setUserData} = userSlice.actions
export default userSlice.reducer