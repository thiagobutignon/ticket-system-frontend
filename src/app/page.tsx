"use client";

import TicketForm, { FormSchemaType } from '@/components/TicketForm';
import TicketList from '@/components/TicketList';
import { useState, useEffect } from 'react';


interface Ticket {
  id: number;
  title: string;
  description: string;
  deadline: string; 
  assignedTo?: string;
  skills?: string[];
}


export default function Home() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const response = await fetch('https://ticket-assignment-system-backend-thiago-butignon.vercel.app/tickets');
      const data = await response.json();
      setTickets(data);
    };

    fetchTickets();
  }, []);

  const handleCreateTicket = async (newTicket: FormSchemaType) => {
    const response = await fetch('https://ticket-assignment-system-backend-thiago-butignon.vercel.app/tickets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTicket),
    });

    if (response.ok) {
      const createdTicket = await response.json();
      setTickets([...tickets, createdTicket]);
    } else {
      // Handle error case
      console.error('Failed to create ticket');
    }
  };


  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Ticket Management System</h1>
      <TicketForm onSubmit={handleCreateTicket} />
      <TicketList tickets={tickets} />
    </main>
  );
}
