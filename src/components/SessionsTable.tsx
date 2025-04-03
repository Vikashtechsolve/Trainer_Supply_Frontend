import React from "react";

type Session = {
  id: string;
  trainer: string;
  client: string;
  sessionType: string;
  dateTime: string;
  status: "In Progress" | "Scheduled" | "Confirmed" | "Completed" | "Cancelled";
};

type SessionsTableProps = {
  sessions: Session[];
  title: string;
};

const SessionsTable: React.FC<SessionsTableProps> = ({ sessions, title }) => {
  const getStatusBadge = (status: Session["status"]) => {
    switch (status) {
      case "In Progress":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800">
            In Progress
          </span>
        );
      case "Scheduled":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
            Scheduled
          </span>
        );
      case "Confirmed":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Confirmed
          </span>
        );
      case "Completed":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
              <th className="px-6 py-3 font-medium">Trainer</th>
              <th className="px-6 py-3 font-medium">Client</th>
              <th className="px-6 py-3 font-medium">Session Type</th>
              <th className="px-6 py-3 font-medium">Date & Time</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
              >
                <td className="px-6 py-4">{session.trainer}</td>
                <td className="px-6 py-4">{session.client}</td>
                <td className="px-6 py-4">{session.sessionType}</td>
                <td className="px-6 py-4">{session.dateTime}</td>
                <td className="px-6 py-4">{getStatusBadge(session.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SessionsTable;
