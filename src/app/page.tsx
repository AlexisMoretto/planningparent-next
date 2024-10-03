'use client'
import Login from './login/page';
import Register from './register/page';
import Home from './home/page';


export default function Main({children} : { children: React.ReactNode }) {

  return (
    <div>        
        <Register />
        <Login />
        <Home />
    </div>
  );
}
