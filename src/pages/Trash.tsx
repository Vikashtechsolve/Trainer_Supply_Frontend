import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DeletedTrainer {
  name: string;
  email: string;
  phoneNo: string;
  qualification: string;
  passingYear: string | number;
  expertise: string;
  resume: string | File | null;
  teachingExperience: string;
  developmentExperience: string;
  totalExperience: string;
  feasibleTime: string;
  payoutExpectation: string;
  location: string;
  remarks: string;
  interview?: "Taken" | "Not taken";
  id?: string | number;
  trashedAt: string;
}

interface DeletedClient {
  name: string;
  email: string;
}

interface DeletedCourse {
  name: string;
  description: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  action: string;
}

// Confirmation Modal Component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  action,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[400px] shadow-xl">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Confirm {action}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Are you sure you want to restore{" "}
          <span className="font-medium text-gray-700">{itemName}</span>? This
          item will be moved back to the active trainers list.
        </p>
        <div className="flex justify-end space-x-3 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};

const Trash: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [deletedTrainers, setDeletedTrainers] = useState<DeletedTrainer[]>([]);
  const [deletedClients] = useState<DeletedClient[]>([]);
  const [deletedCourses] = useState<DeletedCourse[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    trainer: DeletedTrainer | null;
    action: string;
  }>({
    isOpen: false,
    trainer: null,
    action: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Load trashed trainers from localStorage
    const trashedTrainers = JSON.parse(
      localStorage.getItem("trashedTrainers") || "[]"
    );
    setDeletedTrainers(trashedTrainers);
  }, []);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const openRestoreConfirmation = (trainer: DeletedTrainer) => {
    setConfirmationModal({
      isOpen: true,
      trainer: trainer,
      action: "Restore",
    });
  };

  const handleRestoreTrainer = () => {
    if (!confirmationModal.trainer) return;

    const trainer = confirmationModal.trainer;

    // Remove from trashed trainers
    const updatedTrashedTrainers = deletedTrainers.filter(
      (t) => t.name !== trainer.name
    );
    setDeletedTrainers(updatedTrashedTrainers);
    localStorage.setItem(
      "trashedTrainers",
      JSON.stringify(updatedTrashedTrainers)
    );

    // Get current trainers from localStorage or initialize empty array
    const currentTrainers = JSON.parse(
      localStorage.getItem("activeTrainers") || "[]"
    );

    // Add the trainer back to active trainers (without the trashedAt property)
    const { trashedAt, ...trainerData } = trainer;
    currentTrainers.push(trainerData);
    localStorage.setItem("activeTrainers", JSON.stringify(currentTrainers));

    // Show success message
    setSuccess(`Trainer "${trainer.name}" has been restored.`);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trash</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* Trainers Section */}
        <div
          onClick={() => toggleSection("trainers")}
          className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg border"
        >
          <h2 className="text-lg font-semibold">View removed Trainers</h2>
          {deletedTrainers.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
              {deletedTrainers.length}
            </span>
          )}
        </div>

        {activeSection === "trainers" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Expertise</th>
                    <th className="px-6 py-3 font-medium">Trashed At</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedTrainers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No trainers in trash
                      </td>
                    </tr>
                  ) : (
                    deletedTrainers.map((trainer, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{trainer.name}</td>
                        <td className="px-6 py-4">{trainer.email}</td>
                        <td className="px-6 py-4">{trainer.expertise}</td>
                        <td className="px-6 py-4">
                          {new Date(trainer.trashedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openRestoreConfirmation(trainer)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clients Section */}
        <div
          onClick={() => toggleSection("clients")}
          className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg border"
        >
          <h2 className="text-lg font-semibold">View removed Clients</h2>
        </div>

        {activeSection === "clients" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedClients.map((client, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">{client.name}</td>
                      <td className="px-6 py-4">{client.email}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Section */}
        <div
          onClick={() => toggleSection("courses")}
          className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg border"
        >
          <h2 className="text-lg font-semibold">View removed Courses</h2>
        </div>

        {activeSection === "courses" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deletedCourses.map((course, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">{course.name}</td>
                      <td className="px-6 py-4">{course.description}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={handleRestoreTrainer}
        itemName={confirmationModal.trainer?.name || ""}
        action={confirmationModal.action}
      />
    </div>
  );
};

export default Trash;
