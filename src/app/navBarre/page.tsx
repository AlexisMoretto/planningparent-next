'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import './navBarre.scss'
import home from '../../../public/maisonSVG.svg'

export default function NavBarre () {

    const router = useRouter();

    // Route de la navBarre
        
      const addMember = () => {
        router.push('/addMember')
      }
      const goToBudget = () => {
        router.push('/budget')
      }
      const goToShopping = () => {
        router.push('/shopping')
      }
      const goToMeal = () => {
        router.push('/meal')
      }
      const goToMeeting = () => {
        router.push('/meeting')
      }  
      const goToHome = () => {
        router.push('/home')
      }
    return(
        <div className='navBarreContainer'>
            <div className='navBarre'>
      <button className='addMember' type='button' onClick={goToHome}>Acceuil </button>       
      <button className='addMember' type='button' onClick={addMember}>Ajouter un proche</button>
      <button className='addMember' type='button' onClick={goToBudget}>Budget</button>
      <button className='addMember' type='button' onClick={goToShopping}>Course</button>
      <button className='addMember' type='button' onClick={goToMeal}>Repas</button>
      <button className='addMember' type='button' onClick={goToMeeting}>Rendez-vous</button>

      </div>
        </div>
    )

}