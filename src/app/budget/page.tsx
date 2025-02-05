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

export default function BudgetGlobal() {
  const [budgetAmount, setBudgetAmount] = useState<number | undefined>(0);
  const [showInputbudgetAmount, setShowInputbudgetAmount] = useState(false);
  const [showExpenseInput, setShowExpenseInput] = useState(false);
  const [reason, setReason] = useState<string>('');
  const [expense, setExpense] = useState<number | undefined>(0);
  const [expenses, setExpenses] = useState<{ reason: string; amount: number }[]>([]);
  const userData = userStore.getState();
  const [displayTotal, setDisplayTotal] = useState<number>(0);

  // Ajout du montant du budget
  const validateAmountBudget = async (e: any) => {
    e.preventDefault();
    setShowInputbudgetAmount(false);
    try { 
      const response = await axios.post('/api/budget', {
        budget: budgetAmount,
        email: userData.email,
      });
      console.log('Response from /api/budget', response.data);
    } catch (error) {
      console.error("Erreur lors de l'envoi du Budget Prévu");
    }
  };

  // Ajout d'une dépense
  const validateExpense = async (e: any) => {
    e.preventDefault();
    if (expense && reason) {
      const newExpense = { reason, amount: expense };

      try {
        const response = await axios.post('/api/expense', {
          expense,
          reason,
          email: userData.email,
        });
        console.log('UploadedExpense', response.data);

        // Mise à jour de la liste des dépenses
        setExpenses(prevExpenses => [...prevExpenses, newExpense]);
      } catch (error) {
        console.error("Erreur lors de l'envoi des dépenses");
      }

      setReason('');
      setExpense(0);
      setShowExpenseInput(false);
    }
  };

  // Suppression d'une dépense
  const deleteExpense = async (reasonToDelete: string) => {
    try {
      const response = await axios.delete('/api/expense', {
        data: { email: userData.email, reason: reasonToDelete },
      });
      console.log('Dépense supprimée :', response.data);

      // Mise à jour des dépenses après suppression
      setExpenses(prevExpenses => prevExpenses.filter(exp => exp.reason !== reasonToDelete));
    } catch (error) {
      console.error("Erreur lors de la suppression de la dépense", error);
    }
  };

  useEffect(() => {
    const newTotalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    setDisplayTotal((budgetAmount || 0) - newTotalExpense);
  }, [budgetAmount, expenses]);

  // Récupération des dépenses depuis la base de données
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get('/api/expense', {
          params: { email: userData.email },
        });
        const expensesFetched = response.data;
        setExpenses(expensesFetched.map((exp: { reason: any; expense: any; }) => ({ reason: exp.reason, amount: exp.expense })));
      } catch (error) {
        console.error('Erreur lors de la récupération des dépenses', error);
      }
    };

    fetchExpense();
  }, [userData.email]);

  // Récupération du budget depuis la base de données
  useEffect(() => {
    const fetchBudgetAmount = async () => {
      try {
        const response = await axios.get('/api/budget', {
          params: { email: userData.email },
        });
        const fetchedBudget = response.data;
        console.log('fetchedBudget', fetchedBudget);
        setBudgetAmount(fetchedBudget.budget);
      } catch (error) {
        console.error("Erreur lors de la récupération du budget");
      }
    };

    fetchBudgetAmount();
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
                  <button className="done" onClick={validateAmountBudget}>
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
                  <button className="done" onClick={validateExpense}>
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
                    <button className="done" onClick={() => deleteExpense(expense.reason)}>
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
