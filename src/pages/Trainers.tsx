import React, { useState } from "react";
import { Plus } from "lucide-react";
import ActionCard from "../components/ActionCard";
import TrainerForm, { TrainerFormData } from "../components/TrainerForm";
import axios from "axios";
import TrainerTable from "../components/TrainerTable";

interface APIErrorResponse {
  errors: { msg: string }[];
}

const Trainers: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name"); // Default filter type

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

  //trainers Data

  const [trainers, setTrainers] = useState([
    {
      name: "Junaid Khateeb",
      email: "",
      phoneNo: "9323930619",
      qualification: "M.E. (Computer Engineering)",
      passingYear: "2002",
      expertise: "DSA Trainer",
      resume: null as File | null,
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

  const filteredTrainers = trainers.filter((trainer) => {
    const value = trainer[filterType as keyof typeof trainer]; // Access selected field
    return (
      typeof value === "string" &&
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleFormSubmit = async (formData: TrainerFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      setSuccess(null);

      // Log the form data being sent
      console.log("Submitting form data:", formData);

      // Create FormData object for file upload
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
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.post(
        "http://localhost:5000/api/trainers",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTrainers((prevTrainers) => [...prevTrainers, response.data]);

      setSuccess("Trainer added successfully!");
      setIsFormOpen(false);

      console.log("Trainer created:", response.data);
    } catch (err: any) {
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      let errorMessage = "Failed to add trainer. Please try again.";

      if (err.response?.status === 400) {
        if (
          err.response?.data?.message === "User with this email already exists"
        ) {
          errorMessage =
            "A trainer with this email address already exists. Please use a different email.";
        } else if ((err.response?.data as APIErrorResponse)?.errors) {
          errorMessage = (err.response.data as APIErrorResponse).errors
            .map((error) => error.msg)
            .join(", ");
        } else {
          errorMessage = err.response?.data?.message || errorMessage;
        }
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Trainers</h1>
        <div onClick={() => setIsFormOpen(true)}>
          <ActionCard
            icon={<Plus size={24} />}
            title="Add New Trainer"
            description="Create trainer profile"
          />
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
      </div>

      <TrainerTable
        Trainers={searchTerm ? filteredTrainers : trainers}
        title="Trainer List"
      />

      <TrainerForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setError(null);
          setSuccess(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Trainers;
