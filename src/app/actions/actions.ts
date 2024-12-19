import { ACTIONS, User, Img } from "../@types";

export const getActionChangeUserData = (userData: User)=> {
   return { 
    type: ACTIONS.CHANGE_USER_DATA,
    payload: {
        nom: userData.nom || 'valeur bidon',
        prenom: userData.prenom,
        email: userData.email
    }
}
};

export const getActionChangeImgData = (imageData: Img) => {
    return {
        type: ACTIONS.CHANGE_IMAGE,
        payload: {
            name:imageData.name,
            firstName: imageData.firstName,
            email: imageData.email,
            base64: imageData.base64,

}
    }
}