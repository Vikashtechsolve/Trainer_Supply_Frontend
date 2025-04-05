import React from "react";
import { useState, useEffect } from "react";
import Pagination from "./Pagination";

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
  enablePagination?: boolean;
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

// Helper function to validate and format resume URL
const getValidResumeUrl = (resumeUrl: string | null): string => {
  if (!resumeUrl) return "";

  // Check if it's a Google Drive link that needs to be reformatted
  if (resumeUrl.includes("drive.google.com/file/d/")) {
    const fileIdMatch = resumeUrl.match(/\/file\/d\/([^/]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }

  // Check if it's a valid URL
  try {
    new URL(resumeUrl);
    return resumeUrl;
  } catch (e) {
    // If it's not a valid URL, try to make it one
    if (resumeUrl.startsWith("http://") || resumeUrl.startsWith("https://")) {
      return resumeUrl;
    } else {
      return `https://${resumeUrl}`;
    }
  }
};

// ⭐ Resume Modal Component
const ResumeModal: React.FC<ResumeModalProps> = ({ url, isOpen, onClose }) => {
  // Handle escape key press
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscapeKey);
    return () => window.removeEventListener("keydown", handleEscapeKey);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the backdrop, not on the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const [isLoading, setIsLoading] = useState(true);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  if (!isOpen || !url) return null;

  const selectedResume = url;
  const validResumeUrl = getValidResumeUrl(selectedResume);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg p-4 w-[60%] h-[80%] relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-600 hover:text-gray-800 z-10"
        >
          ✕
        </button>
        <div className="w-full h-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-gray-600">Loading resume...</p>
              </div>
            </div>
          )}
          <iframe
            src={validResumeUrl}
            width="100%"
            height="100%"
            style={{ border: "none", minHeight: "80vh" }}
            title="Resume Viewer"
            sandbox="allow-scripts allow-same-origin allow-forms"
            referrerPolicy="no-referrer"
            onLoad={handleIframeLoad}
          />
        </div>
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
  enablePagination = true,
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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedTrainers, setPaginatedTrainers] = useState<Trainers[]>([]);

  // Calculate pagination whenever trainers or pagination settings change
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedTrainers(Trainers.slice(startIndex, endIndex));

    // If current page is now invalid, reset to page 1
    if (
      currentPage > Math.ceil(Trainers.length / itemsPerPage) &&
      Trainers.length > 0
    ) {
      setCurrentPage(1);
    }
  }, [Trainers, currentPage, itemsPerPage]);

  // Get total pages
  const totalPages = Math.max(1, Math.ceil(Trainers.length / itemsPerPage));

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page

    // Save preference to localStorage
    localStorage.setItem(
      "trainerTableItemsPerPage",
      newItemsPerPage.toString()
    );
  };

  // Load saved preference for items per page
  useEffect(() => {
    const savedItemsPerPage = localStorage.getItem("trainerTableItemsPerPage");
    if (savedItemsPerPage) {
      setItemsPerPage(Number(savedItemsPerPage));
    }
  }, []);

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
            {paginatedTrainers.length > 0 ? (
              paginatedTrainers.map((trainer, index) => (
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
                    <td className="px-6 py-4">
                      {trainer.developmentExperience}
                    </td>
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
              ))
            ) : (
              <tr>
                <td
                  colSpan={simplifiedView ? 6 : 16}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  No trainers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add pagination component only if enabled */}
      {enablePagination && Trainers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          totalItems={Trainers.length}
        />
      )}

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
