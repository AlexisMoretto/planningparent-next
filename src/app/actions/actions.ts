import { familyImage, User } from "@prisma/client";
import { ACTIONS } from "../@types";

export const getActionChangeUserData = (userData: User)=> {
   return { 
    type: ACTIONS.CHANGE_USER_DATA,
    payload: {
        name: userData.name || 'valeur bidon',
        firstName: userData.firstName,
        email: userData.email
    }
}
};

export const getActionChangeImgData = (imageData: familyImage) => {
    return {
        type: ACTIONS.CHANGE_IMAGE,
        payload: {
            name:imageData.name,
            firstName: imageData.firstName,
            email: imageData.email,
            base64: imageData.base64,
            mimeType: imageData.mimeType

}
    }
}