import { emit } from "process";
import { ACTIONS, Img } from "../@types";

const imgInitialState: Img = {
    base64: '',
    name: '',
    firstName:'',
    email:','

}



export const imgReducer = (state = imgInitialState, action : {
    type: ACTIONS;
    payload: {
        name: string
        firstName: string;
        email: string
        base64: string
    }
}) => {
    
    if (action.type === ACTIONS.CHANGE_IMAGE) {
        return {
            ...state,
            firstName: action.payload.firstName,
            base64: action.payload.base64,
            email: action.payload.email,
            name: action.payload.name
            
        }       
    }
    console.log("imgState", state);
    return state;
    
}