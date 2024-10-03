import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import { imgReducer } from "../reducers/imgReducer";


// Le store est le composant de gestion d'état
// Le reducer permet de gerer l'initialisation et la modification des états

export const userStore = configureStore({
    // Objet de config dans lequel il doit y avoir une clé appelé reducer avec en valeur le reducer

    reducer: userReducer,
})

export const imgStore = configureStore({
    reducer: imgReducer
})
