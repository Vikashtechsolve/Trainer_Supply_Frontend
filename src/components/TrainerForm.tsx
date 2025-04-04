import React, { useState } from "react";
import { X } from "lucide-react";

export interface TrainerFormData {
  name: string;
  email: string;
  phoneNo: string;
  qualification: string;
  passingYear: string;
  expertise: string;
  resume: File | null;
  teachingExperience: string;
  developmentExperience: string;
  totalExperience: string;
  feasibleTime: string;
  payoutExpectation: string;
  location: string;
  remarks: string;
}

interface TrainerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TrainerFormData) => void | Promise<void>;
  isSubmitting: boolean;
}

const TrainerForm: React.FC<TrainerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}) => {
  const [formData, setFormData] = useState<TrainerFormData>({
    name: "",
    email: "",
    phoneNo: "",
    qualification: "",
    passingYear: "",
    expertise: "",
    resume: null,
    teachingExperience: "",
    developmentExperience: "",
    totalExperience: "",
    feasibleTime: "",
    payoutExpectation: "",
    location: "",
    remarks: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file ?? null, // ✅ UPDATED: Store null if no file selected
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "resume" && value instanceof File) {
        formDataToSend.append(key, value); // ✅ Append file directly
      } else {
        formDataToSend.append(key, String(value));
      }
    });

    onSubmit(formDataToSend); // ✅ Trigger parent submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add New Trainer</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* All input fields left unchanged here */}
            {/* ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume
              </label>
              <input
                type="file"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>
            {/* ... rest of your inputs */}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerForm;
