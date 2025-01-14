'use client';
import { FormEventHandler, MouseEventHandler, ReactElement, useEffect, useState } from 'react';
import './budget.scss';
import check from 'public/checkMark.png';
import cross from 'public/crossMark.png'
import Image from 'next/image';
import axios from 'axios';
import type { Budget, Expense } from '@prisma/client';
import { userStore } from '../store/store';


export default function BudgetGlobal() {
  const [budgetAmount, setBudgetAmount] = useState<number | undefined>(0);
  const [showInputbudgetAmount, setShowInputbudgetAmount] = useState(false);
  const [showExpenseInput, setShowExpenseInput] = useState(false);
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [reason, setReason] = useState<string>('');
  const [expense, setExpense] = useState<number | undefined>(0);
  const [expenses, setExpenses] = useState<{ reason: string; amount: number }[]>([]);
  const userData = userStore.getState()

  const addAmountBudget = () => {
    setShowInputbudgetAmount(true);
  };

  const validateAmountBudget: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    setShowInputbudgetAmount(false);
    try { 
      const response: {data: Budget} = await axios.post('api/uploadBudget', {
        budget:budgetAmount,
        email: userData.email,
      })
      console.log('Response from /api/uploadBudget');
      const uploadedBudgetAmount = response.data
      console.log(uploadedBudgetAmount);
      
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du Budget Prévu')
    }
  };

  const addExpense: MouseEventHandler<HTMLButtonElement> =  () => {
    setShowExpenseInput(true);
    
  };

  const validateExpense: MouseEventHandler<HTMLButtonElement> = async (e)=> {
    e.preventDefault()
    if (expense && reason) {
      const newExpense = { reason, amount: expense };
      // Ajoute la dépense à la liste
      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
      // Met à jour le total des dépenses 
      setTotalExpense((prevTotal) => prevTotal + expense); 
      try {

        const response: {data: Expense} = await axios.post('api/uploadExpense', {
          expense: expense,
          reason: reason,
          email:userData.email
        })
        const uploadedExpense: Expense = response.data
        console.log('UploadedExpense',uploadedExpense);
        
        
      } catch (error) {
        console.error('Erreur lors de l\'envoi des Expenses')
      }
      // Réinitialise le motif
      setReason(''); 
      // Réinitialise le montant
      setExpense(0); 
      // Ferme le formulaire
      setShowExpenseInput(false); 
    }

  };
  // On utilise un useEffect afin de fetch les données du back 
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response: { data: Expense[] } = await axios.get('api/downloadExpense', {
          params: { email: userData.email },
        });
        const expensesFetched: Expense[] = response.data;
        // On met ensuite a jours l'état des dépense et on les déstructures avec comme couple clé/valeur, 
        setExpenses(expensesFetched.map(exp => ({ reason: exp.reason, amount: exp.expense })));
      } catch (error) {
        console.error('Erreur lors de la récupération des dépenses', error);
      }
    };
  
    fetchExpense();
  }, [userData.email]);
  
  const deleteExpense = async (reasonToDelete: string) => {
    try {
      const response = await axios.delete('api/deleteExpense', {
        data: { email: userData.email, reason: reasonToDelete },
      });
      console.log('Dépense supprimée :', response.data);
  
      // On met ensuite à jours manuellement l'état des expenses et on supprime visulement la ligne (elle est supprimé dans la BDD par le call API)
      setExpenses(prevExpenses => prevExpenses.filter(exp => exp.reason !== reasonToDelete));
      console.log(`Dépense avec le motif "${reasonToDelete}" supprimée`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la dépense', error);
    }
  };
  const calculateTotal = (): number => {
    return (budgetAmount || 0) - totalExpense;
  };

  return (
    <div className="budget">
      <div className="title">
        <h1>Budget Prévisionnel</h1>
      </div>
      <div className='mainContainer'>
      <div className="amountBudget">
        <div className="projectedBudget">
          <h2>Budget Prévu</h2>
          <div className="checkButton">
            <button onClick={addAmountBudget}>Ajouter/Modifer un montant</button>
          </div>

          {showInputbudgetAmount && (
            <div className="showButtonAmount">
              <div className='showButtonAmountContainer'>
              <input
                className="inputBudget"
                type="number"
                placeholder="Montant"
                onChange={(event) => {
                  setBudgetAmount(event.currentTarget.valueAsNumber);
                }}
              />
              <div className="checkButton">
                <button className="done" onClick={validateAmountBudget}>
                  <Image className="checkImage" src={check} alt="check" />
                </button>
              </div>
            </div>
            </div>
          )}
          {budgetAmount !== undefined && <p>Budget: {budgetAmount} €</p>}
        </div>
      </div>

      <div className="expense">
        <div className="projectedExpense">
          <h2>Dépense</h2>
          <div className="checkButton">
            <button onClick={addExpense}>Ajouter/modifer une dépense</button>
          </div>

          {showExpenseInput &&  (
            <div className='inputContainer'>
            <div className="showButtonExpense">
              <input
                type="number"
                className="inputExpense"
                placeholder="Montant"
                value={expense || ''}
                onChange={(event) => {
                  setExpense(event.currentTarget.valueAsNumber);
                }}
              />
              <input
                type="text"
                placeholder="Motif de la dépense"
                value={reason}
                onChange={(event) => setReason(event.currentTarget.value)}
              />
              <div className='expenseButton'>
                <button className="done" onClick={validateExpense}>
                  <Image className="checkImage" src={check} alt="check" />
                </button>
                <button className="done" ><Image className='crossImage' src={cross} alt='cross' /></button>
                </div>
            </div>
            </div>
          )}
        </div>
        <div className="expenseContainer">
          {/*Avec le tableau des dépense récupéré de la BDD et mis a jour via le setExpenses, puis onn le destructure en utilisant le couple clé/valeur dépense/index. Et si le tableau n'est pas vide alors la destructuration s'effectue et on affiche les lignes avec le bouton. */}
  {expenses.length > 0 ? (
    expenses.map((expense, index) => (
      <div key={index} className="expenseDiv">
        <p>{`${expense.reason}: ${expense.amount} €`}</p>
        <button
          className="done"
          onClick={() => deleteExpense(expense.reason)}
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

      <div className="total">
        <h2>Total: {calculateTotal()} €</h2>
      </div>
      </div>
    </div>
  );
}
