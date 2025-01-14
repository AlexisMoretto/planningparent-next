'use client'
import { MouseEventHandler, useEffect, useState } from 'react'
import './shopping.scss'
import { Shopping } from '@prisma/client'
import { userStore } from '../store/store'
import axios from 'axios'
import cross from 'public/crossMark.png'
import Image from 'next/image';

export default function ShoppingListFunction () {

    const userData = userStore.getState()
    const [name, setName] = useState<string>('')
    const [list, setList] = useState<{name:string}[]>([])

    const addItem :MouseEventHandler<HTMLButtonElement> = async (e) => {
        e.preventDefault()
        try {
            const response: {data:Shopping} = await axios.post('api/uploadShoppingList', {
               email: userData.email,
               name: name
            })
            console.log("Article ajouté en BDD",response.data);
                        
        } catch (error) {
            console.log("Erreur lors de l'envoi de l'article");
            
        }
        setName('')
        
    }
    const deleteArticle = async (name:string) => {

        console.log("Article supprimé", name);

        try {
            const response = await axios.delete('api/deleteShoppingList', {
                data: {
                    email: userData.email, 
                    name:name
                }
            });
            
            
        } catch (error) {
            console.error("Erreur lors de la suppression de l'article");
            
        }
    }
    useEffect( () => {
        const fetchShoppingList = async () => {
                        
            try {
                const response: {data: Shopping[]} = await axios.get('api/downloadShoppingList',{
                    params: {email:userData.email},
                });
                const itemFetched: Shopping[] = response.data
                // On met ensuite a jour l'état de la liste des articles et on les déstructures avec comme couple clé/valeur,
                setList(itemFetched.map(article => ({
                    name:article.name
                })))
                
                

            } catch (error) {
                console.error('Erreur lors de la récupération de la liste: Email manquant')
            }
        }
        fetchShoppingList()
    }),[name]
    return(
        <div className='shopping'>
        <div className="title">
            <h1>Courses</h1>
        </div>
        <div className='shoppingListTitle'><h2> Liste de course</h2></div>
        <div className='addShoppingItem'>
            <input type="text" placeholder="Article" onChange={(e) => {
                setName(e.currentTarget.value)
            }} />
            <button className='addShoppingItemButton' onClick={addItem} >Ajouter</button>
        </div>
        <div className='shoppingList'>
        {list.length > 0 ? (            
    list.map((list, index) => (
      <div key={index} className="shoppingDiv">
        <p>{`${list.name}`}</p>
        <button
          className="done"
          onClick={() => deleteArticle(list.name)}
        >
          <Image className="crossImage" src={cross} alt="Supprimer" />
        </button>
      </div>
    ))
  ) : (
    <p>Aucune dépense enregistrée</p>
  )}
        </div>
        </div>
    )
}