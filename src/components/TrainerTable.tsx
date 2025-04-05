import React from "react";
import { useState } from "react";

type Trainers = {
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
};

interface TrainerTableProps {
  Trainers: Trainers[];
  title: string;
  onTrashTrainer?: (trainer: Trainers) => void;
  onEditTrainer?: (trainer: Trainers) => void;
  simplifiedView?: boolean;
}

interface ResumeModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  trainerName: string;
  action: string;
}

// Confirmation Modal Component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  trainerName,
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
          Are you sure you want to move{" "}
          <span className="font-medium text-gray-700">{trainerName}</span> to
          the trash? This item can be restored later.
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
            className="px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700"
          >
            Move to Trash
          </button>
        </div>
      </div>
    </div>
  );
};

// ⭐ NEW ADDITION: Resume Modal Component
const ResumeModal: React.FC<ResumeModalProps> = ({ url, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getEmbedUrl = (url: string) => {
    if (url.includes("drive.google.com")) {
      return url.replace("/view?usp=sharing", "/preview");
    }
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-[60%] h-[80%] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <iframe
          src={getEmbedUrl(url)}
          className="w-full h-full rounded-md"
          title="Resume Preview"
          style={{ transform: "scale(0.7)", transformOrigin: "top center" }}
          allow="autoplay"
        />
      </div>
    </div>
  );
};

const TrainersTable: React.FC<TrainerTableProps> = ({
  Trainers,
  title,
  onTrashTrainer,
  onEditTrainer,
  simplifiedView = false,
}) => {
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    trainer: Trainers | null;
    action: string;
  }>({
    isOpen: false,
    trainer: null,
    action: "",
  });

  const toggleDropdown = (index: number) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
    }
  };

  const handleTrashClick = (trainer: Trainers) => {
    setConfirmationModal({
      isOpen: true,
      trainer: trainer,
      action: "Trash",
    });
    setOpenDropdown(null);
  };

  const handleEditClick = (trainer: Trainers) => {
    if (onEditTrainer) {
      onEditTrainer(trainer);
      setOpenDropdown(null);
    }
  };

  const confirmTrashTrainer = () => {
    if (confirmationModal.trainer && onTrashTrainer) {
      onTrashTrainer(confirmationModal.trainer);
    }
  };

  const handleViewResume = (resume: string | File | null) => {
    if (resume && typeof resume === "string") {
      setSelectedResume(resume);
    } else {
      setSelectedResume(null);
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
              <th className="px-6 py-3 font-medium">Name</th>
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">Qualification</th>
              )}
              <th className="px-6 py-3 font-medium">Expertise</th>
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">
                  Total years of teaching
                </th>
              )}
              <th className="px-6 py-3 font-medium">Resume</th>
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">Contact no</th>
              )}
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">email</th>
              )}
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">passing years</th>
              )}
              <th className="px-6 py-3 font-medium">Teaching experience</th>
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">
                  Development experience
                </th>
              )}
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">Feasible time</th>
              )}
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">Expected payout</th>
              )}
              <th className="px-6 py-3 font-medium">Location</th>
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">Remarks</th>
              )}
              {!simplifiedView && (
                <th className="px-6 py-3 font-medium">Interview</th>
              )}
              <th className="px-6 py-3 font-medium">Options</th>
            </tr>
          </thead>
          <tbody>
            {Trainers.map((trainer, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{trainer.name}</td>
                {!simplifiedView && (
                  <td className="px-6 py-4">{trainer.qualification}</td>
                )}
                <td className="px-6 py-4">{trainer.expertise}</td>
                {!simplifiedView && (
                  <td className="px-6 py-4">{trainer.totalExperience}</td>
                )}
                <td className="px-6 py-4">
                  {trainer.resume ? (
                    <button
                      onClick={() => handleViewResume(trainer.resume)}
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      View Resume
                    </button>
                  ) : (
                    "No file uploaded"
                  )}
                </td>
                {!simplifiedView && (
                  <td className="px-6 py-4">{trainer.phoneNo}</td>
                )}
                {!simplifiedView && (
                  <td className="px-6 py-4">{trainer.email}</td>
                )}
                {!simplifiedView && (
                  <td className="px-6 py-4">{trainer.passingYear}</td>
                )}
                <td className="px-6 py-4">{trainer.teachingExperience}</td>
                {!simplifiedView && (
                  <td className="px-6 py-4">{trainer.developmentExperience}</td>
                )}
                {!simplifiedView && (
                  <td className="px-6 py-4">{trainer.feasibleTime}</td>
                )}
                {!simplifiedView && (
                  <td className="px-6 py-4">{trainer.payoutExpectation}</td>
                )}
                <td className="px-6 py-4">{trainer.location}</td>
                {!simplifiedView && (
                  <td className="px-6 py-4">{trainer.remarks}</td>
                )}
                {!simplifiedView && (
                  <td className="px-6 py-4">
                    {trainer.interview ? (
                      <span
                        className={`px-3 py-1.5 rounded-md font-medium text-sm ${
                          trainer.interview === "Taken"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {trainer.interview}
                      </span>
                    ) : (
                      "Not taken"
                    )}
                  </td>
                )}
                <td className="px-6 py-4 relative">
                  <div className="relative inline-block">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
                        />
                      </svg>
                    </button>

                    {openDropdown === index && (
                      <div className="absolute right-6 top-0 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1 shadow-sm">
                          <button
                            onClick={() => handleEditClick(trainer)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100"
                          >
                            Edit
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed border-b border-gray-100">
                            Delete
                          </button>
                          <button
                            onClick={() => handleTrashClick(trainer)}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Trash
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ResumeModal
        url={selectedResume || ""}
        isOpen={!!selectedResume}
        onClose={() => setSelectedResume(null)}
      />
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={confirmTrashTrainer}
        trainerName={confirmationModal.trainer?.name || ""}
        action={confirmationModal.action}
      />
    </div>
  );
};

export default TrainersTable;
