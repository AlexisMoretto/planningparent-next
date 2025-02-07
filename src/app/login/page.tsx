'use client'
import React, { FormEventHandler, useState } from 'react'
import './Login.scss'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { getActionChangeImgData, getActionChangeUserData } from '../actions/actions'
import { imgStore, userStore } from '../store/store'
import { handleSubmit } from 'src/utils/apiFunctions'




export default function Login() {

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [errorMessage, setErrorMessage] = useState<string>('');     

    const router = useRouter();

    const handleSubmitLogin: (e:any) => void = (e) => {
        e.preventDefault()
        handleSubmit(email, password)
        router.push('/home')
    }
    

    
    return (
        <div className='login'>
            <div className='loginTitle'>
            <h1>Connexion</h1>
            </div>
            <div>
            <form  className='form'action="" onSubmit={handleSubmitLogin}>
                <label htmlFor="email">Email</label>
                <input type="email" placeholder='E-mail' required
                onChange={(event) => {
                    setEmail(event.currentTarget.value)
                }} />
                <label htmlFor="">Mot de passe</label>
                <input type="password" placeholder='Mot de passe' required
                onChange={(event) => {
                    setPassword(event.currentTarget.value)                    
                }} />
                <div className='link'>
                    <button type='submit'>Valider</button>
                </div>
            </form>
            </div>
        </div>
    )
}