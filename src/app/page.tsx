'use client'
import Login from './login/page';
import Register from './register/page';
import Home from './home/page';
import { useState } from 'react';
import { userStore } from './store/store';


export default function Main({children} : { children: React.ReactNode }) {

  const [isLogged, setIsLogged] = useState(false)
  const userData = userStore.getState() 
  const isLoggedIn = () => {
    if(userData.token){
      setIsLogged(true)
    } else {''}
  }
 

  return (
    <div>        
        <Register />
        
        { isLogged ? (
          <div >
        <Login/>
        <Home/>
        </div>) : ''}
        
        
    </div>
  );
}
