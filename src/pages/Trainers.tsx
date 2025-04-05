import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ActionCard from "../components/ActionCard";
import TrainerForm, { TrainerFormData } from "../components/TrainerForm";
import axios from "axios";
import TrainerTable from "../components/TrainerTable";
import { useNavigate } from "react-router-dom";

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

  // Load trainers from localStorage on initial render
  useEffect(() => {
    const activeTrainers = localStorage.getItem("activeTrainers");
    if (activeTrainers) {
      setTrainers(JSON.parse(activeTrainers));
    } else {
      // Initialize localStorage with current trainers if not already set
      localStorage.setItem("activeTrainers", JSON.stringify(trainers));
    }
  }, []);

  // Update localStorage whenever trainers change
  useEffect(() => {
    localStorage.setItem("activeTrainers", JSON.stringify(trainers));
  }, [trainers]);

  // Load simplifiedView preference from localStorage
  useEffect(() => {
    const savedSimplifiedView = localStorage.getItem("simplifiedTableView");
    if (savedSimplifiedView) {
      setSimplifiedView(savedSimplifiedView === "true");
    }
  }, []);

  // Save simplifiedView preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("simplifiedTableView", simplifiedView.toString());
  }, [simplifiedView]);

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
            // Find the trainer being edited by ID if available, otherwise by name
            const matchesTrainer = editingTrainer.id
              ? t.id === editingTrainer.id
              : t.name === editingTrainer.name;

            if (matchesTrainer) {
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
                id: formData.id,
              };
            }
            return t;
          })
        );
        setSuccess("Trainer updated successfully!");
      } else {
        // Create FormData object for file upload (for new trainers)
        const submitData = new FormData();
        Object.keys(formData).forEach((key) => {
          const value = formData[key as keyof TrainerFormData];
          if (key === "resume" && value instanceof File) {
            submitData.append("resume", value);
          } else if (typeof value === "string") {
            submitData.append(key, value);
          } else {
            console.warn(`Skipping key ${key} due to unexpected type:`, value);
          }
        });

        // Log the FormData contents
        for (const pair of submitData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }

        // Here you would normally make an API call
        /* Uncomment when backend is ready
        const response = await axios.post(
          "http://localhost:5000/api/trainers",
          submitData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        */

        // For now, just add to the local state
        const newTrainer: Trainer = {
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
    // Remove from trainers list
    setTrainers(trainers.filter((t) => t.name !== trainer.name));

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
        Trainers={sortedTrainers}
        title="Trainer List"
        onTrashTrainer={handleTrashTrainer}
        onEditTrainer={handleEditTrainer}
        simplifiedView={simplifiedView}
      />

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
