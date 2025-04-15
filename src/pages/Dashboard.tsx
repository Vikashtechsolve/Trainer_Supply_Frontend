import React, { useState } from "react";
import TrainerStatusCards from "../components/ui/TrainerStatusCards";
import TrainerDetailsModal from "../components/ui/TrainerDetailsModal";

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const trainerData = {
    "Active Trainer": [
      { name: "John Doe", status: "Active", interviewDate: "2025-03-15" },
      { name: "Jane Smith", status: "Active", interviewDate: "2025-03-14" },
    ],
    "Selected Trainer": [
      { name: "Mark Brown", status: "Selected", interviewDate: "2025-03-10" },
    ],
    "Pending Trainer": [
      { name: "Lucy Green", status: "Pending", interviewDate: "" },
    ],
    "Rejected Trainer": [
      { name: "Tom Black", status: "Rejected", interviewDate: "2025-03-01" },
    ],
  };

  const handleCardClick = (status) => {
    setSelectedStatus(status);
    setIsModalOpen(true); // Opens the modal when a card is clicked
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Closes the modal
  };

  return (
    <div className="dashboard p-4">
      <h1 className="text-3xl font-semibold mb-6">Trainer Status Dashboard</h1>

      {/* Trainer Status Cards */}
      <TrainerStatusCards onStatusClick={handleCardClick} />

      {/* Trainer Details Modal */}
      <TrainerDetailsModal
        isOpen={isModalOpen}
        status={selectedStatus}
        onClose={handleCloseModal}
        trainers={trainerData[selectedStatus] || []}
      />
    </div>
  );
};

export default Dashboard;
