import { emit } from "process";
import { ACTIONS } from "../@types";
import { familyImage } from "@prisma/client";

const imgInitialState: familyImage = {
    base64: '',
    name: '',
    firstName:'',
    email:'',
    mimeType: '',
    createdAt: new Date ,
    id: 0,

}



export const imgReducer = (state = imgInitialState, action : {
    type: ACTIONS;
    payload: {
        name: string
        firstName: string;
        email: string
        base64: string
        mimeType: string
    }
}) => {
    
    if (action.type === ACTIONS.CHANGE_IMAGE) {
        return {
            ...state,
            firstName: action.payload.firstName,
            base64: action.payload.base64,
            email: action.payload.email,
            name: action.payload.name,
            mimeType: action.payload.mimeType,
            
        }       
    }
    return state;
    
}