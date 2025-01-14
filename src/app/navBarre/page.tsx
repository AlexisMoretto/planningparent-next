'use client'

import { useRouter } from 'next/navigation'
import './navBarre.scss'

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

    return(
        <div className='navBarreContainer'>
            <div className='navBarre'>
      <button className='addMember' type='button' onClick={addMember}>Ajouter un proche</button>
      <button className='addMember' type='button' onClick={goToBudget}>Budget</button>
      <button className='addMember' type='button' onClick={goToShopping}>Course</button>
      <button className='addMember' type='button' onClick={goToMeal}>Repas</button>
      <button className='addMember' type='button' onClick={goToMeeting}>Rendez-vous</button>

      </div>
        </div>
    )

}