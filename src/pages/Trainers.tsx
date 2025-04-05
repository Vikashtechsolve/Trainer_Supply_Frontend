import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ActionCard from "../components/ActionCard";
import TrainerForm, { TrainerFormData } from "../components/TrainerForm";
import axios from "axios";
import TrainerTable from "../components/TrainerTable";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

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
  ];

  const sortOptions = [
    { label: "None", value: "" },
    { label: "Passing Year", value: "passingYear" },
    { label: "Total Experience", value: "totalExperience" },
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
    },
  ]);

  // Effect to load trainers from localStorage on component mount
  useEffect(() => {
    const storedTrainers = localStorage.getItem("trainers");
    if (storedTrainers) {
      try {
        setTrainers(JSON.parse(storedTrainers));
      } catch (error) {
        console.error("Failed to parse trainers from localStorage:", error);
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
        console.error(
          "Failed to parse simplifiedView from localStorage:",
          error
        );
      }
    }
  }, []);

  // Effect to save trainers to localStorage whenever trainers state changes
  useEffect(() => {
    // Ensure all trainers have IDs before storing
    const trainersWithIds = trainers.map((trainer) => {
      if (!trainer.id) {
        return { ...trainer, id: generateUUID() };
      }
      return trainer;
    });

    // Only update if there are changes
    if (JSON.stringify(trainers) !== JSON.stringify(trainersWithIds)) {
      setTrainers(trainersWithIds);
    } else {
      localStorage.setItem("trainers", JSON.stringify(trainers));
    }
  }, [trainers]); // Add trainers to dependency array

  // Effect to save simplifiedView preference to localStorage
  useEffect(() => {
    localStorage.setItem("simplifiedView", JSON.stringify(simplifiedView));
  }, [simplifiedView]); // Add simplifiedView to dependency array

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

    // If current page is now invalid, reset to page 1
    if (
      currentPage > Math.ceil(sortedTrainers.length / itemsPerPage) &&
      sortedTrainers.length > 0
    ) {
      setCurrentPage(1);
    }
  }, [sortedTrainers, currentPage, itemsPerPage]);

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

  // Handle edit trainer action
  const handleEditTrainer = (trainer: Trainer) => {
    // Set the trainer being edited
    setEditingTrainer(trainer);

    // Convert the trainer data to match TrainerFormData format
    const formData: TrainerFormData = {
      name: trainer.name,
      email: trainer.email,
      phoneNo: trainer.phoneNo,
      qualification: trainer.qualification,
      passingYear:
        typeof trainer.passingYear === "number"
          ? trainer.passingYear.toString()
          : trainer.passingYear,
      expertise: trainer.expertise,
      resume: trainer.resume,
      teachingExperience: trainer.teachingExperience,
      developmentExperience: trainer.developmentExperience,
      totalExperience: trainer.totalExperience,
      feasibleTime: trainer.feasibleTime,
      payoutExpectation: trainer.payoutExpectation,
      location: trainer.location,
      remarks: trainer.remarks,
      id: trainer.id,
    };

    // Set the initial form data for the form
    setInitialFormData(formData);
    setIsFormOpen(true);
  };

  // Handle form submission (for both create and update)
  const handleFormSubmit = async (formData: TrainerFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Check if we're editing an existing trainer
      const isEditing = !!editingTrainer;

      // Log the form data being sent
      console.log(`${isEditing ? "Updating" : "Creating"} trainer:`, formData);

      // For now, we'll handle client-side updates since there's no backend
      if (isEditing && editingTrainer) {
        // Update the trainer in the local state
        setTrainers((prevTrainers) =>
          prevTrainers.map((t) => {
            // Always use ID for matching
            if (t.id === editingTrainer.id) {
              // Convert form data back to Trainer format
              return {
                ...t,
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
              };
            }
            return t;
          })
        );
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
          console.log("Would upload file:", formData.resume.name);
        }

        // Create new trainer with guaranteed ID
        const newTrainer: Trainer = {
          id: generateUUID(), // Always generate a new ID
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
        };

        setTrainers((prevTrainers) => [...prevTrainers, newTrainer]);
        setSuccess("Trainer added successfully!");
      }

      // Reset form state
      setIsFormOpen(false);
      setEditingTrainer(null);
      setInitialFormData(undefined);
    } catch (err: unknown) {
      console.error("Error details:", {
        message: err instanceof Error ? err.message : String(err),
        response: (err as { response?: { data?: unknown; status?: number } })
          ?.response?.data,
        status: (err as { response?: { status?: number } })?.response?.status,
      });

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

  // Handle trashing a trainer
  const handleTrashTrainer = (trainer: Trainer) => {
    // Remove from trainers list using ID for reliable identification
    setTrainers(trainers.filter((t) => t.id !== trainer.id));

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
