'use client'
import { MouseEventHandler, useEffect, useState } from 'react'
import './shopping.scss'
import { Shopping } from '@prisma/client'
import { userStore } from '../store/store'
import axios from 'axios'
import cross from 'public/crossMark.svg'
import Image from 'next/image';
import ClientLayout from '../ClientLayout'

export default function ShoppingListFunction () {

    const userData = userStore.getState()
    const [name, setName] = useState<string>('')
    const [list, setList] = useState<{name:string}[]>([])

    const handleKeyDownAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if(e.key === 'Enter') {
            addItem(e)
        }
    }
    

    const addItem = async (e:any) => {
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
    const fetchShoppingList = async () => {
                        
        try {
            const response: {data: Shopping[]} = await axios.get('api/shopping',{
                params: {email:userData.email},
            });
            const itemFetched: Shopping[] = response.data
            console.log('Liste de courses',itemFetched);
            
            // On met ensuite a jour l'état de la liste des articles et on les déstructures avec comme couple clé/valeur,
            setList(itemFetched.map(article => ({
                name:article.name
            })))
            
            

        } catch (error) {
            console.error('Erreur lors de la récupération de la liste: Email manquant')
        }
    }
    useEffect( () => {        
        fetchShoppingList()        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    return(
        <ClientLayout>
        <div className='shopping'>
        <div className="title">
            <h1>Courses</h1>
        </div>
        <div className='shoppingListTitle'><h2> Liste de course</h2></div>
        <div className='addShoppingItem'>
            <input className='addShoppingItem' type="text" placeholder="Article" 
            onChange={(e) => {
                setName(e.currentTarget.value)

            }} 
            onKeyDown={handleKeyDownAddItem}/>
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
        </ClientLayout>
    )
}