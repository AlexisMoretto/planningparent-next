'use client'
import { MouseEventHandler, useEffect, useState } from 'react'
import './shopping.scss'
import { Shopping } from '@prisma/client'
import { userStore } from '../store/store'
import axios from 'axios'
import cross from 'public/crossMark.svg'
import Image from 'next/image';
import ClientLayout from '../ClientLayout'
import { addItem, deleteArticle, fetchShoppingList } from 'src/utils/apiFunctions'

export default function ShoppingListFunction () {

    const userData = userStore.getState()
    const [name, setName] = useState<string>('')
    const [list, setList] = useState<{name:string}[]>([])

    const handleKeyDownAddItem = (e: React.KeyboardEvent<HTMLInputElement>) => {

        if(e.key === 'Enter') {
            handleAddItem()
        }
    }
    
 const handleAddItem = async () => {
    try {
       await addItem( userData.email,name)
       fetchShoppingList(userData.email, setList,)
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'article :", error);
    } 

    
 }
    
    const handleDeleteArticle = async (name:string) => {
        try {
            await deleteArticle(name, userData.email)
            fetchShoppingList(userData.email, setList)
        } catch (error) {
            console.error("Erreur lors de la suppression de l'article :", error);
        }
        
              
    }
    
    useEffect( () => {    
            
        fetchShoppingList(userData.email, setList)        
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
            <button className='addShoppingItemButton' onClick={handleAddItem} >Ajouter</button>
        </div>
        <div className='shoppingList'>
        {list.length > 0 ? (            
    list.map((list, index) => (
      <div key={index} className="shoppingDiv">
        <p>{`${list.name}`}</p>
        <button
          className="done"
          onClick={()=> handleDeleteArticle(list.name)}
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