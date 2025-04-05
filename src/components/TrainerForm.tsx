import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface TrainerFormData {
  name: string;
  email: string;
  phoneNo: string;
  qualification: string;
  passingYear: string;
  expertise: string;
  resume: File | string | null; // Updated to allow string for existing URLs
  teachingExperience: string;
  developmentExperience: string;
  totalExperience: string;
  feasibleTime: string;
  payoutExpectation: string;
  location: string;
  remarks: string;
  id?: string | number; // Add id for editing existing trainers
}

interface TrainerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TrainerFormData) => void | Promise<void>;
  isSubmitting: boolean;
  initialData?: TrainerFormData; // Add prop for initial data
  isEditing?: boolean; // Add prop to indicate editing mode
}

const TrainerForm: React.FC<TrainerFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  isEditing = false,
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

  // When initialData changes, update the form data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file ?? prev[name], // Keep existing value if no new file selected
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

    // Keep existing resume URL if it's a string and no new file was uploaded
    const dataToSubmit = {
      ...formData,
      // Preserve ID if editing
      id: isEditing && initialData?.id ? initialData.id : undefined,
    };

    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  // Determine if we have an existing resume
  const hasExistingResume =
    typeof formData.resume === "string" && formData.resume;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Trainer" : "Add New Trainer"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualification
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Passing Year
              </label>
              <input
                type="text"
                name="passingYear"
                value={formData.passingYear}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expertise
              </label>
              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resume
              </label>
              {hasExistingResume && (
                <div className="mb-2 text-sm text-blue-600">
                  <a
                    href={formData.resume as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    View current resume
                  </a>
                </div>
              )}
              <input
                type="file"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required={!hasExistingResume && !isEditing}
                disabled={isSubmitting}
              />
              {isEditing && (
                <p className="text-xs text-gray-500 mt-1">
                  Upload a new file only if you want to replace the existing
                  resume
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teaching Experience
              </label>
              <input
                type="text"
                name="teachingExperience"
                value={formData.teachingExperience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Development Experience
              </label>
              <input
                type="text"
                name="developmentExperience"
                value={formData.developmentExperience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Experience
              </label>
              <input
                type="text"
                name="totalExperience"
                value={formData.totalExperience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feasible Time
              </label>
              <input
                type="text"
                name="feasibleTime"
                value={formData.feasibleTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payout Expectation
              </label>
              <input
                type="text"
                name="payoutExpectation"
                value={formData.payoutExpectation}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isSubmitting}
              />
            </div>
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
              {isSubmitting ? "Submitting..." : isEditing ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerForm;
