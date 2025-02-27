import React from 'react';

interface Ticket {
  id: number;
  title: string;
  description: string;
  deadline: string;
  assignedTo?: string;
  skills?: string[];
}

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tickets.map((ticket) => (
        <div key={ticket.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">{ticket.title}</h2>
          <p className="text-gray-700 mb-2">{ticket.description}</p>
          <p className="text-gray-500">Deadline: {ticket.deadline}</p>
          {ticket.assignedTo && <p className="text-gray-500">Assigned to: {ticket.assignedTo}</p>}
          {ticket.skills && ticket.skills.length > 0 && (
            <div className="flex mt-2">
              {ticket.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">{skill}</span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketList;
