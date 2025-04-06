import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export interface VendorFormData {
  name: string;
  company: string;
  email: string;
  phoneNo: string;
  pastRelationship: string;
  link: string;
  contactPersonPosition: string;
  status: string;
  trainerSupplied: string[];
  location: string;
  id?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface VendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: VendorFormData) => void | Promise<void>;
  isSubmitting: boolean;
  initialData?: VendorFormData;
  isEditing?: boolean;
}

const VendorForm: React.FC<VendorFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  initialData,
  isEditing = false,
}) => {
  const [formData, setFormData] = useState<VendorFormData>({
    name: "",
    company: "",
    email: "",
    phoneNo: "",
    pastRelationship: "",
    link: "",
    contactPersonPosition: "",
    status: "Pending",
    trainerSupplied: [],
    location: "",
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [trainersSuppliedInput, setTrainersSuppliedInput] = useState("");

  // When initialData changes, update the form data
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setErrors({}); // Clear any validation errors
      setTouched({}); // Reset touched state
    }
  }, [initialData]);

  const validateField = (
    name: string,
    value: string | string[] | null
  ): string => {
    // Initialize regex patterns
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

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
      case "company":
        if (!value) return "Company is required";
        break;
      case "pastRelationship":
        if (!value) return "Past relationship is required";
        break;
      case "contactPersonPosition":
        if (!value) return "Contact person position is required";
        break;
      case "location":
        if (!value) return "Location is required";
        break;
    }
    return "";
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      // Skip validation for trainersSupplied as it's optional
      if (key === "trainerSupplied" || key === "link") {
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
    const { name, value } = e.target;

    // Mark field as touched
    setTouched((prev) => ({ ...prev, [name]: true }));

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate the field
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate on blur
    const value = formData[name as keyof VendorFormData];
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTrainersSuppliedAdd = () => {
    if (trainersSuppliedInput.trim() === "") return;

    setFormData((prev) => ({
      ...prev,
      trainerSupplied: [...prev.trainerSupplied, trainersSuppliedInput.trim()],
    }));

    setTrainersSuppliedInput("");
  };

  const handleTrainersSuppliedRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      trainerSupplied: prev.trainerSupplied.filter((_, i) => i !== index),
    }));
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
      id: isEditing && initialData?.id ? initialData.id : undefined,
    };

    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {isEditing ? "Edit Vendor" : "Add New Vendor"}
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
                Company <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${
                  touched.company && errors.company
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } rounded-md focus:outline-none focus:ring-2`}
                required
                disabled={isSubmitting}
              />
              {touched.company && errors.company && (
                <p className="mt-1 text-sm text-red-500">{errors.company}</p>
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
                Past Relationship <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pastRelationship"
                value={formData.pastRelationship}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${
                  touched.pastRelationship && errors.pastRelationship
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } rounded-md focus:outline-none focus:ring-2`}
                required
                disabled={isSubmitting}
              />
              {touched.pastRelationship && errors.pastRelationship && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.pastRelationship}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link
              </label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://example.com"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Website or social media link for the vendor
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Person Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactPersonPosition"
                value={formData.contactPersonPosition}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${
                  touched.contactPersonPosition && errors.contactPersonPosition
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } rounded-md focus:outline-none focus:ring-2`}
                required
                disabled={isSubmitting}
              />
              {touched.contactPersonPosition &&
                errors.contactPersonPosition && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.contactPersonPosition}
                  </p>
                )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border ${
                  touched.location && errors.location
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-primary"
                } rounded-md focus:outline-none focus:ring-2`}
                required
                disabled={isSubmitting}
              />
              {touched.location && errors.location && (
                <p className="mt-1 text-sm text-red-500">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <input
                type="text"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Active, Inactive, Pending, etc."
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">
                Set any status you prefer (e.g., Active, Inactive, Pending)
              </p>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trainers Supplied
            </label>
            <div className="flex">
              <input
                type="text"
                value={trainersSuppliedInput}
                onChange={(e) => setTrainersSuppliedInput(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter trainer type and press Add"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={handleTrainersSuppliedAdd}
                className="px-4 py-2 bg-primary text-white rounded-r-md hover:bg-primary/90 disabled:opacity-50"
                disabled={isSubmitting || !trainersSuppliedInput.trim()}
              >
                Add
              </button>
            </div>
            {formData.trainerSupplied.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.trainerSupplied.map((trainer, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full flex items-center text-sm"
                  >
                    <span>{trainer}</span>
                    <button
                      type="button"
                      className="ml-2 text-gray-500 hover:text-red-500"
                      onClick={() => handleTrainersSuppliedRemove(index)}
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
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

export default VendorForm;
