import './shopping.scss'

export default function Shopping () {

    const addItem = () => {
        
    }

    return(
        <div className='shopping'>
        <div className="title">
            <h1>Courses</h1>
        </div>
        <div className='shoppingListTitle'><h2> Liste de course</h2></div>
        <div className='addShoppingItem'>
            <input type="text" placeholder="Article" />
            <input type="text" placeholder='Prix' />
            <button className='addShoppingItemButton'>Ajouter</button>
        </div>
        <div className='shoppingList'></div>
        </div>
    )
}