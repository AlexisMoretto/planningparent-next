import { ACTIONS, Img } from "../@types";

const imgInitialState: Img = {
    url: '',
}

export const imgReducer = (state = imgInitialState, action : {
    type: ACTIONS;
    payload: {
        url: string;
    }
}) => {
    
    if (action.type === ACTIONS.CHANGE_IMAGE) {
        return {
            ...state,
            url: action.payload.url,
            
        }       
    }
    console.log("imgState", state);
    return state;
    
}