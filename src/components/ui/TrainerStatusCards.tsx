import React from "react";

const TrainerStatusCards = ({ onStatusClick }) => {
  const trainerStatuses = [
    { status: "Active Trainer", count: 5, color: "bg-green-500" },
    { status: "Selected Trainer", count: 3, color: "bg-yellow-500" },
    { status: "Pending Trainer", count: 8, color: "bg-blue-500" },
    { status: "Rejected Trainer", count: 2, color: "bg-red-500" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {trainerStatuses.map(({ status, count, color }, index) => (
        <div
          key={index}
          className={`${color} p-6 rounded-lg shadow-lg text-white cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl`}
          onClick={() => onStatusClick(status)} // Trigger the modal or action
        >
          <h3 className="text-xl font-semibold mb-2">{status}</h3>
          <p className="text-2xl font-bold">{count} Trainers</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm">View Details</span>
            <span className="text-sm">➡</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TrainerStatusCards;
