/* eslint-disable react/no-unescaped-entities */
'use client'
import './Register.scss'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { getActionChangeUserData } from '../actions/actions'
import { userStore } from '../store/store'
import { User } from '../@types'

export default function Register () {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [firstName, setFirstName] = useState('')

    const router = useRouter();

     const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        try {
            
            const response = await axios.post('/api/register', {email, password, name, firstName} as User)

            // Vérification d'envoie

            if (!email || !password || !name || !firstName) {
                alert('Tous les champs sont requis');
                return;
              }              
            const actionChangeUserData = getActionChangeUserData(response.data as User)
            userStore.dispatch(actionChangeUserData)
            console.log('Response.data',response.data);
            
            router.push('/home')
            
        } catch (error) { console.error('Registration Failed', error);
        }
        
    }
    const handleLogin = () => {
        router.push('/login')
    }
    

    return(

        <div className='register'> 
        <div className='registerTitle'>
        <h1>Bienvenue sur planningParent</h1>
        <p>L'application dédié à la gestion du quotidien en famille</p>
        <p>Veuillez vous enregistrer</p>
        </div>
            <form onSubmit={handleSubmit}>
                
            <div className='formContainer'>
            <input type="text" placeholder='Nom' required 
            onChange ={(event)=> {
                setName(event.currentTarget.value)
            }}/>
            <input type="text" placeholder='Prénom' required
            onChange ={(event)=> {
                setFirstName(event.currentTarget.value)
            }} />
            <input type="email" placeholder="email" 
            onChange={(event) => {setEmail(event.target.value)}}
            required
            />
            <input type="password" placeholder="password" 
            onChange={(event) => {
                setPassword(event.currentTarget.value)                    
            }}
            required
            />
            <div className='submitButton'>
                    <button type='submit'>Valider</button>
                </div>
            <div className='loginButton'>
                <p>Déjà un compte :</p>
                <button onClick={handleLogin}>Se Connecter</button>
                </div>    
                </div>
                </form>
                
        </div>
    )
}


