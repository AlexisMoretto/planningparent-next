'use client';
import { FormEventHandler, MouseEventHandler, useEffect, useState } from 'react';
import './budget.scss';
import check from '../../../public/checkMark.svg';
import cross from '../../../public/crossMark.svg';
import Image from 'next/image';
import axios from 'axios';
import type { Budget, Expense } from '@prisma/client';
import { userStore } from '../store/store';
import ClientLayout from '../ClientLayout';
import { deleteExpense, fetchBudgetAmount, fetchExpense, validateAmountBudget, validateExpense } from 'src/utils/apiFunctions';

export default function BudgetGlobal() {
  const [budgetAmount, setBudgetAmount] = useState<number>(0);
  const [showInputbudgetAmount, setShowInputbudgetAmount] = useState(false);
  const [showExpenseInput, setShowExpenseInput] = useState(false);
  const [reason, setReason] = useState<string>('');
  const [expense, setExpense] = useState<number>(0);
  const [expenses, setExpenses] = useState<{ reason: string; amount: number }[]>([]);
  const userData = userStore.getState();
  const [displayTotal, setDisplayTotal] = useState<number>(0);

  // Ajout du montant du budget
  
const handleValidateBudget = (e:any) => {
  e.preventDefault();
  validateAmountBudget(budgetAmount,userData.email,setShowInputbudgetAmount,setBudgetAmount)
}
  // Ajout d'une dépense
  const handleValidateExpense = (e: any) => {
    e.preventDefault();
    validateExpense(expense, reason, userData.email, setExpenses, setExpense, setReason, setShowExpenseInput);
  };
  
 // Supprimer une dépense
  const handleDeleteExpense = (reason: string) => {   
    deleteExpense( reason,userData.email, setExpenses)
    
  }

  useEffect(() => {
    const newTotalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    setDisplayTotal((budgetAmount || 0) - newTotalExpense);
  }, [budgetAmount, expenses]);

  // Récupération des dépenses depuis la base de données
  useEffect(()=> {
    if(userData.email) {
      fetchExpense( userData.email , setExpenses);
    }
    

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[userData.email])
    
  // Récupération du budget depuis la base de données
  useEffect(() => {
    if (userData.email) {
      fetchBudgetAmount(userData.email, setBudgetAmount);
    }
    
  }, [userData.email]);

  return (
    <ClientLayout>
      <div className="budget">
        <div className="title">
          <h1>Budget Prévisionnel</h1>
        </div>
        <div className='mainContainer'>
          <div className="amountBudget">
            <div className="projectedBudget">
              <h2>Budget Prévu</h2>
              <button onClick={() => setShowInputbudgetAmount(true)}>Ajouter/Modifier un montant</button>

              {showInputbudgetAmount && (
                <div className="showButtonAmount">
                  <input
                    type="number"
                    placeholder="Montant"
                    onChange={(event) => setBudgetAmount(event.currentTarget.valueAsNumber)}
                  />
                  <button className="done" onClick={handleValidateBudget}>
                    <Image className="checkImage" src={check} alt="check" />
                  </button>
                </div>
              )}
              {budgetAmount !== undefined && <p>Budget: {budgetAmount} €</p>}
            </div>
          </div>

          <div className="expense">
            <div className="projectedExpense">
              <h2>Dépense</h2>
              <button onClick={() => setShowExpenseInput(true)}>Ajouter/modifier une dépense</button>

              {showExpenseInput && (
                <div className="showButtonExpense">
                  <input
                    type="number"
                    placeholder="Montant"
                    value={expense || ''}
                    onChange={(event) => setExpense(event.currentTarget.valueAsNumber)}
                  />
                  <input
                    type="text"
                    placeholder="Motif de la dépense"
                    value={reason}
                    onChange={(event) => setReason(event.currentTarget.value)}
                  />
                  <button className="done" onClick={handleValidateExpense}>
                    <Image className="checkImage" src={check} alt="check" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="expenseContainer">
              {expenses.length > 0 ? (
                expenses.map((expense, index) => (
                  <div key={index} className="expenseDiv">
                    <p>{`${expense.reason}: ${expense.amount} €`}</p>
                    <button className="done" onClick={() => handleDeleteExpense(expense.reason)}>
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
            <h2>Total: {displayTotal}€</h2>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}
