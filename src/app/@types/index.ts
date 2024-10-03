export interface User {
    name: string;
    password: string;
    email: string;
    id: number;
    token:string;
    prenom:string
  }
export interface Img {
    url: string,
}

export enum ACTIONS {
  CHANGE_USER_DATA = 'CHANGE_USER_DATA',
  CHANGE_IMAGE = 'CHANGE_IMAGE'
}