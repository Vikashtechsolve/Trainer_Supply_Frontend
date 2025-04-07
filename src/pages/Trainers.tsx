import React, { useState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import ActionCard from "../components/ActionCard";
import TrainerForm, { TrainerFormData } from "../components/TrainerForm";
import axios from "axios";
import TrainerTable from "../components/TrainerTable";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import { logger } from "../utils/logger";

interface APIErrorResponse {
  errors: { msg: string }[];
}

// Define the Trainer type
type Trainer = {
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
  status: "Selected" | "Rejected" | "Pending";
  id?: string | number;
};

// Simple UUID generator function
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Trainers: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [simplifiedView, setSimplifiedView] = useState<boolean>(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [initialFormData, setInitialFormData] = useState<
    TrainerFormData | undefined
  >(undefined);
  const navigate = useNavigate();

  // Add paginated trainers state
  const [paginatedTrainers, setPaginatedTrainers] = useState<Trainer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Use ref to track previous values
  const prevSortedTrainersLengthRef = useRef<number>(0);
  const isInitialMount = useRef(true);

  const filterOptions = [
    "name",
    "expertise",
    "passingYear",
    "qualification",
    "totalExperience",
    "teachingExperience",
    "developmentExperience",
    "location",
    "payoutExpectation",
    "feasibleTime",
    "remarks",
    "status",
  ];

  const sortOptions = [
    { label: "None", value: "" },
    { label: "Passing Year", value: "passingYear" },
    { label: "Total Experience", value: "totalExperience" },
    { label: "Status", value: "status" },
  ];
  //trainers Data

  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      name: "Junaid Khateeb",
      email: "",
      phoneNo: "9323930619",
      qualification: "M.E. (Computer Engineering)",
      passingYear: "2002",
      expertise: "DSA Trainer",
      resume:
        "https://drive.google.com/file/d/1nwkpN72Nx7w29snOChBqos_c6eYj6cab/view?usp=sharing",
      teachingExperience: "22yrs",
      developmentExperience: "3 yrs",
      totalExperience: "22 yrs",
      feasibleTime: "",
      payoutExpectation: "Depends on the project",
      location: "",
      remarks: "",
      status: "Pending",
    },
    {
      name: "Prabhat Chandra",
      email: "",
      phoneNo: "9999106219",
      qualification: "b.tech",
      passingYear: "2003",
      expertise: "DSA Trainer",
      resume: null as File | null,
      teachingExperience: "18 yrs",
      developmentExperience: "18 yrs",
      totalExperience: "18 yrs",
      feasibleTime: "",
      payoutExpectation: "",
      location: "",
      remarks: "",
      status: "Pending",
    },
  ]);

  // Effect to load trainers from localStorage on component mount
  useEffect(() => {
    const storedTrainers = localStorage.getItem("trainers");
    if (storedTrainers) {
      try {
        setTrainers(JSON.parse(storedTrainers));
      } catch (error) {
        // Remove console.error statement
      }
    }
  }, []); // Empty dependency array is correct here as we only want to load on mount

  // Effect to load simplifiedView preference from localStorage
  useEffect(() => {
    const savedSimplifiedView = localStorage.getItem("simplifiedView");
    if (savedSimplifiedView) {
      try {
        setSimplifiedView(JSON.parse(savedSimplifiedView));
      } catch (error) {
        // Remove console.error statement
      }
    }
  }, []);

  // Create a dedicated function to save trainers to localStorage
  const saveTrainersToLocalStorage = (trainersToSave: Trainer[]) => {
    try {
      // Ensure all trainers have IDs before storing
      const trainersWithIds = trainersToSave.map((trainer) => {
        if (!trainer.id) {
          return { ...trainer, id: generateUUID() };
        }
        return trainer;
      });

      // Save to localStorage
      localStorage.setItem("trainers", JSON.stringify(trainersWithIds));

      // If we added IDs, update state (but avoid infinite loops)
      if (JSON.stringify(trainersToSave) !== JSON.stringify(trainersWithIds)) {
        setTrainers(trainersWithIds);
      }
    } catch (error) {
      // Remove console.error statement
    }
  };

  // Effect to save simplifiedView preference to localStorage
  useEffect(() => {
    localStorage.setItem("simplifiedView", JSON.stringify(simplifiedView));
  }, [simplifiedView]);

  // Load pagination preferences
  useEffect(() => {
    const savedItemsPerPage = localStorage.getItem("trainersPageItemsPerPage");
    if (savedItemsPerPage) {
      setItemsPerPage(Number(savedItemsPerPage));
    }
  }, []);

  const filteredTrainers = trainers.filter((trainer) => {
    const value = trainer[filterType as keyof typeof trainer]; // Access selected field
    return (
      typeof value === "string" &&
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedTrainers = [...filteredTrainers].sort((a, b) => {
    if (!sortField) return 0; // No sorting applied

    const valA = a[sortField as keyof typeof a];
    const valB = b[sortField as keyof typeof b];

    // Convert string-based numeric values to actual numbers
    const numA = typeof valA === "string" ? parseInt(valA) : valA;
    const numB = typeof valB === "string" ? parseInt(valB) : valB;

    if (numA < numB) return sortOrder === "asc" ? -1 : 1;
    if (numA > numB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Apply pagination after filtering and sorting
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedTrainers(sortedTrainers.slice(startIndex, endIndex));
  }, [sortedTrainers, currentPage, itemsPerPage]);

  // Separate useEffect to check for invalid pages
  useEffect(() => {
    // Skip on initial mount since we already set default values
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only run when length changes to avoid infinite loops
    if (prevSortedTrainersLengthRef.current !== sortedTrainers.length) {
      prevSortedTrainersLengthRef.current = sortedTrainers.length;

      const maxPage = Math.max(
        1,
        Math.ceil(sortedTrainers.length / itemsPerPage)
      );
      if (sortedTrainers.length > 0 && currentPage > maxPage) {
        setCurrentPage(1);
      }
    }
  }, [sortedTrainers.length, itemsPerPage]); // Deliberately exclude currentPage to prevent cycles

  // Get total pages
  const totalPages = Math.max(
    1,
    Math.ceil(sortedTrainers.length / itemsPerPage)
  );

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
      "trainersPageItemsPerPage",
      newItemsPerPage.toString()
    );
  };

  // Add/update trainer function
  const addOrUpdateTrainer = (trainer: Trainer) => {
    try {
      const updatedTrainers = [...trainers];
      const index = updatedTrainers.findIndex((t) => t.id === trainer.id);

      if (index !== -1) {
        // Update existing trainer
        updatedTrainers[index] = trainer;
      } else {
        // Add new trainer
        updatedTrainers.push(trainer);
      }

      setTrainers(updatedTrainers);
      saveTrainersToLocalStorage(updatedTrainers);
    } catch (error) {
      logger.error("Error updating trainer:", error);
    }
  };

  // Handle trashing a trainer
  const handleTrashTrainer = (trainer: Trainer) => {
    // Remove from trainers list using ID for reliable identification
    const updatedTrainers = trainers.filter((t) => t.id !== trainer.id);

    // Update state
    setTrainers(updatedTrainers);

    // Save updated trainers to localStorage
    saveTrainersToLocalStorage(updatedTrainers);

    // Add to localStorage for trash
    const trashedTrainers = JSON.parse(
      localStorage.getItem("trashedTrainers") || "[]"
    );
    trashedTrainers.push({
      ...trainer,
      trashedAt: new Date().toISOString(),
    });
    localStorage.setItem("trashedTrainers", JSON.stringify(trashedTrainers));

    // Show success message
    setSuccess(`Trainer "${trainer.name}" has been moved to trash.`);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Handle form submission (for both create and update)
  const handleFormSubmit = async (formData: TrainerFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Check if we're editing an existing trainer
      const isEditing = !!editingTrainer;

      if (isEditing && editingTrainer) {
        // Update the trainer
        const updatedTrainer: Trainer = {
          ...editingTrainer,
          name: formData.name,
          email: formData.email,
          phoneNo: formData.phoneNo,
          qualification: formData.qualification,
          passingYear: formData.passingYear,
          expertise: formData.expertise,
          resume: formData.resume,
          teachingExperience: formData.teachingExperience,
          developmentExperience: formData.developmentExperience,
          totalExperience: formData.totalExperience,
          feasibleTime: formData.feasibleTime,
          payoutExpectation: formData.payoutExpectation,
          location: formData.location,
          remarks: formData.remarks,
          status: formData.status || editingTrainer.status,
        };

        addOrUpdateTrainer(updatedTrainer);
        setSuccess("Trainer updated successfully!");
      } else {
        // Handle resume for new trainer
        let resumeToStore = formData.resume;
        if (formData.resume instanceof File) {
          // In a real app with backend, you'd upload the file here
          // For now, we'll just store a placeholder URL
          resumeToStore = `resume-placeholder-${formData.name.replace(
            /\s+/g,
            "-"
          )}.pdf`;
        }

        // Create new trainer
        const newTrainer: Trainer = {
          id: generateUUID(),
          name: formData.name,
          email: formData.email,
          phoneNo: formData.phoneNo,
          qualification: formData.qualification,
          passingYear: formData.passingYear,
          expertise: formData.expertise,
          resume: resumeToStore,
          teachingExperience: formData.teachingExperience,
          developmentExperience: formData.developmentExperience,
          totalExperience: formData.totalExperience,
          feasibleTime: formData.feasibleTime,
          payoutExpectation: formData.payoutExpectation,
          location: formData.location,
          remarks: formData.remarks,
          status: formData.status || "Pending",
        };

        addOrUpdateTrainer(newTrainer);
        setSuccess("Trainer added successfully!");
      }

      // Reset form state
      setIsFormOpen(false);
      setEditingTrainer(null);
      setInitialFormData(undefined);
    } catch (err: unknown) {
      let errorMessage = `Failed to ${
        editingTrainer ? "update" : "add"
      } trainer. Please try again.`;

      if (
        (err as { response?: { status?: number } })?.response?.status === 400
      ) {
        if (
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message === "User with this email already exists"
        ) {
          errorMessage =
            "A trainer with this email address already exists. Please use a different email.";
        } else if (
          (
            (err as { response?: { data?: APIErrorResponse } })?.response
              ?.data as APIErrorResponse
          )?.errors
        ) {
          errorMessage = (
            (err as { response?: { data?: APIErrorResponse } })?.response
              ?.data as APIErrorResponse
          ).errors
            .map((error) => error.msg)
            .join(", ");
        } else {
          errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || errorMessage;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle editing a trainer
  const handleEditTrainer = (trainer: Trainer) => {
    // Check if this is a status update (comparing with the existing trainer)
    const existingTrainer = trainers.find((t) => t.id === trainer.id);
    if (existingTrainer && existingTrainer.status !== trainer.status) {
      // This is just a status update
      const updatedTrainer = { ...trainer };

      // Update the local state only once
      const updatedTrainers = trainers.map((t) =>
        t.id === trainer.id ? updatedTrainer : t
      );
      setTrainers(updatedTrainers);

      // Save to localStorage
      saveTrainersToLocalStorage(updatedTrainers);

      // If connected to backend API, update there too
      // Don't call addOrUpdateTrainer which would trigger another state update
      updateTrainerStatus(trainer.id as string, trainer.status);
      return;
    }

    // Otherwise, it's a regular edit action - open the form
    setEditingTrainer(trainer);

    const formData: TrainerFormData = {
      id: trainer.id,
      name: trainer.name,
      email: trainer.email,
      phoneNo: trainer.phoneNo,
      qualification: trainer.qualification,
      passingYear: trainer.passingYear.toString(),
      expertise: trainer.expertise,
      resume: trainer.resume,
      teachingExperience: trainer.teachingExperience,
      developmentExperience: trainer.developmentExperience,
      totalExperience: trainer.totalExperience,
      feasibleTime: trainer.feasibleTime,
      payoutExpectation: trainer.payoutExpectation,
      location: trainer.location,
      remarks: trainer.remarks,
      status: trainer.status,
    };

    // Set the initial form data for the form
    setInitialFormData(formData);
    setIsFormOpen(true);
  };

  // Function to update trainer status via API
  const updateTrainerStatus = async (
    trainerId: string,
    status: "Selected" | "Rejected" | "Pending"
  ) => {
    const maxRetries = 3;
    let retryCount = 0;

    const attemptUpdate = async (): Promise<void> => {
      try {
        // Make API call to update status
        await axios.patch(
          `${
            process.env.VITE_API_URL || "http://localhost:5000"
          }/api/trainers/${trainerId}/status`,
          {
            status,
          }
        );

        // Show success message
        setSuccess(`Trainer status updated to ${status} successfully!`);

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);

        return; // Success, exit the function
      } catch (error) {
        logger.error("Error updating trainer status:", error);
        // If we have retries left, try again
        if (retryCount < maxRetries - 1) {
          retryCount++;
          // Wait for 1 second before retrying (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * Math.pow(2, retryCount))
          );
          return attemptUpdate();
        }

        // If we're out of retries, handle the error
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        const isNetworkError =
          error instanceof Error && error.message.includes("network");

        setError(
          isNetworkError
            ? `Network error: Unable to update trainer status. Please check your internet connection.`
            : `Failed to update trainer status: ${errorMessage}`
        );

        // Clear error message after 5 seconds
        setTimeout(() => {
          setError(null);
        }, 5000);

        // Even if the API call failed, update the local state to maintain UI consistency
        const updatedTrainers = trainers.map((trainer) =>
          trainer.id === trainerId ? { ...trainer, status } : trainer
        );
        setTrainers(updatedTrainers);
        saveTrainersToLocalStorage(updatedTrainers);
      }
    };

    // Start the update attempt
    await attemptUpdate();
  };

  const toggleSimplifiedView = () => {
    setSimplifiedView(!simplifiedView);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Trainers</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <label
              htmlFor="simplified-view-toggle"
              className="text-sm text-gray-600 cursor-pointer"
            >
              Show only necessary columns
            </label>
            <div className="relative inline-block w-10 h-5 align-middle select-none">
              <input
                type="checkbox"
                id="simplified-view-toggle"
                checked={simplifiedView}
                onChange={toggleSimplifiedView}
                className="opacity-0 absolute w-0 h-0"
              />
              <label
                htmlFor="simplified-view-toggle"
                className={`block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
                  simplifiedView ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out ${
                    simplifiedView ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </label>
            </div>
          </div>
          <div onClick={() => setIsFormOpen(true)}>
            <ActionCard
              icon={<Plus size={24} />}
              title="Add New Trainer"
              description="Create trainer profile"
            />
          </div>
        </div>
      </div>
      <p className="text-gray-500">Manage your training staff here.</p>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="flex gap-2 items-center mb-4">
        {/* Dropdown Menu */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded-md"
        >
          {filterOptions.map((option) => (
            <option key={option} value={option}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </option>
          ))}
        </select>

        {/* Search Input */}
        <input
          type="text"
          placeholder={`Search by ${filterType}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded-md w-full max-w-md"
        />

        {/* Sorting Dropdown (Added Sorting UI) */}
        <select
          value={sortField}
          onChange={(e) => setSortField(e.target.value)}
          className="border p-2 rounded-md"
        >
          <option value="">Sort by</option>
          <option value="totalExperience">Total Experience</option>
          <option value="passingYear">Passing Year</option>
          <option value="status">Status</option>
        </select>

        {/* Ascending/Descending Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          className="border p-2 rounded-md"
        >
          {sortOrder === "asc" ? "⬆ Asc" : "⬇ Desc"}
        </button>
      </div>

      <TrainerTable
        Trainers={paginatedTrainers}
        title={`Trainer List (${sortedTrainers.length} total${
          searchTerm ? ", filtered" : ""
        })`}
        onTrashTrainer={handleTrashTrainer}
        onEditTrainer={handleEditTrainer}
        simplifiedView={simplifiedView}
        enablePagination={false}
      />

      {/* Add pagination component */}
      {sortedTrainers.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
            totalItems={sortedTrainers.length}
          />
        </div>
      )}

      <TrainerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTrainer(null);
          setInitialFormData(undefined);
          setError(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialData={initialFormData}
        isEditing={!!editingTrainer}
      />
    </div>
  );
};

export default Trainers;
