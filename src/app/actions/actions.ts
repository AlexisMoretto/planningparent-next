import { familyImage, User } from "@prisma/client";
import { ACTIONS } from "../@types";

export const getActionChangeUserData = (userData: User)=> {
   return { 
    type: ACTIONS.CHANGE_USER_DATA,
    payload: {
        name: userData.name as string || 'valeur bidon',
        firstName: userData.firstName as string,
        email: userData.email as string
    }
}
};

export const getActionChangeImgData = (imageData: familyImage) => {
    return {
        type: ACTIONS.CHANGE_IMAGE,
        payload: {
            name:imageData.name as string,
            firstName: imageData.firstName as string,
            email: imageData.email as string,
            base64: imageData.base64 as string,
            mimeType: imageData.mimeType as string

}
    }
}