import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface TrainerFormData {
  name: string;
  email: string;
  phoneNo: string;
  qualification: string;
  passingYear: string;
  expertise: string;
  resume: File | string | null; // Can be File (new upload), string (URL), or null
  teachingExperience: string;
  developmentExperience: string;
  totalExperience: string;
  feasibleTime: string;
  payoutExpectation: string;
  location: string;
  remarks: string;
  id?: string | number; // Add id for editing existing trainers
}

interface ValidationErrors {
  [key: string]: string;
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

  // Store a flag to track if a new file was uploaded
  const [newFileUploaded, setNewFileUploaded] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // When initialData changes, update the form data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setNewFileUploaded(false); // Reset file upload flag when initialData changes
      setErrors({}); // Clear any validation errors
      setTouched({}); // Reset touched state
    }
  }, [initialData]);

  const validateField = (
    name: string,
    value: string | number | File | null
  ): string => {
    // Initialize regex patterns outside switch
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;
    const currentYear = new Date().getFullYear();

    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (typeof value === "string" && !emailRegex.test(value))
          return "Please enter a valid email address";
        break;
      case "phoneNo":
        if (!value) return "Phone number is required";
        if (
          typeof value === "string" &&
          !phoneRegex.test(value.replace(/[^0-9]/g, ""))
        )
          return "Please enter a valid phone number (10-15 digits)";
        break;
      case "name":
        if (!value) return "Name is required";
        if (typeof value === "string" && value.length < 2)
          return "Name must be at least 2 characters";
        break;
      case "passingYear":
        if (!value) return "Passing year is required";
        if (typeof value === "string") {
          const year = parseInt(value);
          if (isNaN(year) || year < 1950 || year > currentYear + 5)
            return `Please enter a valid year between 1950 and ${
              currentYear + 5
            }`;
        } else if (typeof value === "number") {
          if (value < 1950 || value > currentYear + 5)
            return `Please enter a valid year between 1950 and ${
              currentYear + 5
            }`;
        }
        break;
      case "teachingExperience":
      case "developmentExperience":
      case "totalExperience":
        if (!value)
          return `${name.replace(/([A-Z])/g, " $1").toLowerCase()} is required`;
        break;
    }
    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      // Skip validation for resume if editing and has existing resume
      if (
        key === "resume" &&
        isEditing &&
        typeof initialData?.resume === "string"
      ) {
        return;
      }

      const error = validateField(key, value);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormData((prev) => ({
          ...prev,
          [name]: file,
        }));
        setNewFileUploaded(true);

        // Validate the file
        const error =
          file.size > 5 * 1024 * 1024
            ? "File size should be less than 5MB"
            : "";
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Validate the field
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur
    const value = formData[name as keyof TrainerFormData];
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as { [key: string]: boolean });

    setTouched(allTouched);

    // Validate the form
    if (!validateForm()) {
      return; // Don't submit if validation fails
    }

    // Prepare form data for submission
    const dataToSubmit = {
      ...formData,
      resume:
        newFileUploaded || !isEditing
          ? formData.resume
          : initialData?.resume || null,
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
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${
                  touched.name && errors.name
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } rounded-md focus:outline-none focus:ring-2`}
                required
                disabled={isSubmitting}
              />
              {touched.name && errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${
                  touched.email && errors.email
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } rounded-md focus:outline-none focus:ring-2`}
                required
                disabled={isSubmitting}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${
                  touched.phoneNo && errors.phoneNo
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } rounded-md focus:outline-none focus:ring-2`}
                required
                disabled={isSubmitting}
              />
              {touched.phoneNo && errors.phoneNo && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNo}</p>
              )}
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
                Resume{" "}
                {!hasExistingResume && !isEditing && (
                  <span className="text-red-500">*</span>
                )}
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
                  {newFileUploaded && (
                    <span className="ml-2 text-orange-500">
                      (Will be replaced with new file)
                    </span>
                  )}
                </div>
              )}
              <input
                type="file"
                name="resume"
                onChange={handleChange}
                accept=".pdf,.doc,.docx"
                className={`w-full px-3 py-2 border ${
                  touched.resume && errors.resume
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } rounded-md focus:outline-none focus:ring-2`}
                required={!hasExistingResume && !isEditing}
                disabled={isSubmitting}
              />
              {touched.resume && errors.resume && (
                <p className="mt-1 text-sm text-red-500">{errors.resume}</p>
              )}
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
