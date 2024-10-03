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
    

    return(

        <div className='register'>
            <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Nom' 
            onChange ={(event)=> {
                setName(event.currentTarget.value)
            }}/>
            <input type="text" placeholder='Prénom'
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
                </form>
        </div>
    )
}


