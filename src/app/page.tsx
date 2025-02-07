'use client'
import Register from './register/page';
import Home from './home/page';
import Budget from './budget/page';
import Shopping from './shopping/page';
import Meal from './meal/page';
import AddMember from './addMember/page';
import Login from './login/page';

import { useState } from 'react';
import { userStore } from './store/store';
import { User } from '@prisma/client';



export default function Main({children} : { children: React.ReactNode }) {

  const [isLogged, setIsLogged] = useState<boolean>(false)
  const userData :User  = userStore.getState() 

  const isLoggedIn = () => {
    if(userData.token){
      setIsLogged(true)
    } else {''}
  }
 

  return (
    
    <div>      
        
        <Register />        
        { isLogged ?  (
          <div>
          
        <Login/>
        <Home/>
        <AddMember/>
        <Budget/>
        <Shopping/>
        <Meal/>
        
        </div>) : ''}
        
        
    </div>
  );
}
