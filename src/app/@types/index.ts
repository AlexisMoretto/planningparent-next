export interface User {
    nom: string;
    password: string;
    email: string;
    id: number;
    token:string;
    prenom:string
  }
export interface Img {
  firstName: string,
  name: string,
  email: string
  base64: string
}

export enum ACTIONS {
  CHANGE_USER_DATA = 'CHANGE_USER_DATA',
  CHANGE_IMAGE = 'CHANGE_IMAGE'
}