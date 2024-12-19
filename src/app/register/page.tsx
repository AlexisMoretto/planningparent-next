/* eslint-disable react/no-unescaped-entities */
'use client'
import './Register.scss'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Register () {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [firstname, setFirstname] = useState('')

    const router = useRouter();

     const handleSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault()

        try {
            
            const response = await axios.post('/api/register', {email, password, name, firstname})
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
                setFirstname(event.currentTarget.value)
            }} />
            <input type="email" placeholder="email" 
            onChange={(event) => {setEmail(event.target.value)}}
            required
            />
            <input type="text" placeholder="password" 
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


