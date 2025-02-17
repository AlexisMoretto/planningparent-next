import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userReducer";
import { imgReducer } from "../reducers/imgReducer";



// Le store est le composant de gestion d'état
// Le reducer permet de gerer l'initialisation et la modification des états

export const userStore = configureStore({
    // Objet de config dans lequel il doit y avoir une clé appelé reducer avec en valeur le reducer

    reducer: {
        user: userReducer
    }
    
})

export const imgStore = configureStore({
    reducer: imgReducer
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type UserRootState = ReturnType<typeof userStore.getState>
export type ImgRootState = ReturnType<typeof imgStore.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type UserAppDispatch = typeof userStore.dispatch
export type ImgAppDispatch = typeof imgStore.dispatch