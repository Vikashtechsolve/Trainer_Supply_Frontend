import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import ActionCard from "../components/ActionCard";
import axios from "axios";
import VendorTable from "../components/VendorTable";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";
import StatusBadge from "../components/StatusBadge";
import VendorForm, { VendorFormData } from "../components/VendorForm";
import { logger } from "../utils/logger";

interface APIErrorResponse {
  errors: { msg: string }[];
}

// Define the Vendor type
type Vendor = {
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
};

// Simple UUID generator function
const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Vendors: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("name");
  const [sortField, setSortField] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [simplifiedView, setSimplifiedView] = useState<boolean>(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [initialFormData, setInitialFormData] = useState<
    VendorFormData | undefined
  >(undefined);
  const navigate = useNavigate();

  // Add paginated vendors state
  const [paginatedVendors, setPaginatedVendors] = useState<Vendor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filterOptions = [
    "name",
    "company",
    "email",
    "pastRelationship",
    "contactPersonPosition",
    "location",
    "status",
  ];

  const sortOptions = [
    { label: "None", value: "" },
    { label: "Name", value: "name" },
    { label: "Company", value: "company" },
    { label: "Status", value: "status" },
  ];

  // Empty vendors array
  const [vendors, setVendors] = useState<Vendor[]>([]);

  // Effect to load vendors from localStorage on component mount
  useEffect(() => {
    const storedVendors = localStorage.getItem("vendors");
    if (storedVendors) {
      try {
        setVendors(JSON.parse(storedVendors));
      } catch (error) {
        // Remove console.error statement
      }
    }
  }, []);

  // Effect to load simplifiedView preference from localStorage
  useEffect(() => {
    const savedSimplifiedView = localStorage.getItem("vendorsSimplifiedView");
    if (savedSimplifiedView) {
      try {
        setSimplifiedView(JSON.parse(savedSimplifiedView));
      } catch (error) {
        // Remove console.error statement
      }
    }
  }, []);

  // Create a dedicated function to save vendors to localStorage
  const saveVendorsToLocalStorage = (vendorsToSave: Vendor[]) => {
    try {
      // Ensure all vendors have IDs before storing
      const vendorsWithIds = vendorsToSave.map((vendor) => {
        if (!vendor.id) {
          return { ...vendor, id: generateUUID() };
        }
        return vendor;
      });

      // Save to localStorage
      localStorage.setItem("vendors", JSON.stringify(vendorsWithIds));

      // If we added IDs, update state (but avoid infinite loops)
      if (JSON.stringify(vendorsToSave) !== JSON.stringify(vendorsWithIds)) {
        setVendors(vendorsWithIds);
      }
    } catch (error) {
      // Remove console.error statement
    }
  };

  // Effect to save simplifiedView preference to localStorage
  useEffect(() => {
    localStorage.setItem(
      "vendorsSimplifiedView",
      JSON.stringify(simplifiedView)
    );
  }, [simplifiedView]);

  // Load pagination preferences
  useEffect(() => {
    const savedItemsPerPage = localStorage.getItem("vendorsPageItemsPerPage");
    if (savedItemsPerPage) {
      setItemsPerPage(Number(savedItemsPerPage));
    }
  }, []);

  const filteredVendors = vendors.filter((vendor) => {
    const value = vendor[filterType as keyof typeof vendor];
    return (
      typeof value === "string" &&
      value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (!sortField) return 0; // No sorting applied

    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];

    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortOrder === "asc"
        ? fieldA.localeCompare(fieldB)
        : fieldB.localeCompare(fieldA);
    }
    return 0;
  });

  // Effect to update paginated vendors when filtered/sorted vendors change
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedVendors(sortedVendors.slice(startIndex, endIndex));
  }, [sortedVendors, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    localStorage.setItem("vendorsPageItemsPerPage", newItemsPerPage.toString());
  };

  const addOrUpdateVendor = (vendor: Vendor) => {
    const existingIndex = vendors.findIndex((t) => t.id === vendor.id);

    if (existingIndex >= 0) {
      // Update existing vendor
      const updatedVendors = [...vendors];
      updatedVendors[existingIndex] = vendor;
      setVendors(updatedVendors);
      saveVendorsToLocalStorage(updatedVendors);
      setSuccess("Vendor updated successfully!");
    } else {
      // Add new vendor with generated ID
      const newVendor = {
        ...vendor,
        id: generateUUID(),
      };
      const newVendors = [...vendors, newVendor];
      setVendors(newVendors);
      saveVendorsToLocalStorage(newVendors);
      setSuccess("Vendor added successfully!");
    }
  };

  const handleTrashVendor = (vendor: Vendor) => {
    const vendorId = vendor.id;
    if (!vendorId) return;

    // Add the current date to the vendor object before storing in trash
    const vendorToTrash = {
      ...vendor,
      trashedAt: new Date().toISOString(),
    };

    // Get the current trashed vendors or initialize an empty array
    const trashedVendors = JSON.parse(
      localStorage.getItem("trashedVendors") || "[]"
    );

    // Add the vendor to the trashed vendors
    trashedVendors.push(vendorToTrash);

    // Save the updated trashed vendors list
    localStorage.setItem("trashedVendors", JSON.stringify(trashedVendors));

    // Remove the vendor from the active vendors list
    const updatedVendors = vendors.filter((vendor) => vendor.id !== vendorId);
    setVendors(updatedVendors);
    saveVendorsToLocalStorage(updatedVendors);
    setSuccess("Vendor moved to trash successfully.");
  };

  const handleFormSubmit = async (formData: VendorFormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const vendorData: Vendor = {
        ...formData,
        id: editingVendor?.id,
      };

      // In a real app, you'd create/update via API call
      // For now, just update local state
      addOrUpdateVendor(vendorData);
      setIsFormOpen(false);
      setEditingVendor(null);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data) {
        const errorData = err.response.data as APIErrorResponse;
        setError(
          errorData.errors?.map((e) => e.msg).join(", ") ||
            "Failed to submit vendor data."
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setInitialFormData({
      name: vendor.name,
      company: vendor.company,
      email: vendor.email,
      phoneNo: vendor.phoneNo,
      pastRelationship: vendor.pastRelationship,
      link: vendor.link,
      contactPersonPosition: vendor.contactPersonPosition,
      status: vendor.status,
      trainerSupplied: vendor.trainerSupplied,
      location: vendor.location,
    });
    setIsFormOpen(true);
  };

  const updateVendorStatus = async (vendorId: string, status: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // In a real app, you'd call an API endpoint to update status
      // For now, just update local state
      const vendorIndex = vendors.findIndex((v) => v.id === vendorId);
      if (vendorIndex !== -1) {
        const updatedVendors = [...vendors];
        updatedVendors[vendorIndex] = {
          ...updatedVendors[vendorIndex],
          status,
        };
        setVendors(updatedVendors);
        saveVendorsToLocalStorage(updatedVendors);
        setSuccess(`Vendor status updated to ${status}`);
      }
    } catch (err) {
      setError("Failed to update vendor status. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleSimplifiedView = () => {
    setSimplifiedView(!simplifiedView);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Vendors Management</h1>
        <button
          onClick={() => {
            setEditingVendor(null);
            setInitialFormData(undefined);
            setIsFormOpen(true);
          }}
          className="flex items-center bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="mr-2" size={18} />
          Add Vendor
        </button>
      </div>

      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label
            htmlFor="searchTerm"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search Vendors
          </label>
          <input
            type="text"
            id="searchTerm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <div>
          <label
            htmlFor="filterType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Filter By
          </label>
          <select
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          >
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="sortField"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Sort By
          </label>
          <div className="flex space-x-2">
            <select
              id="sortField"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          onClick={toggleSimplifiedView}
          className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300"
        >
          {simplifiedView ? "Detailed View" : "Simplified View"}
        </button>
      </div>

      <VendorTable
        vendors={paginatedVendors}
        title={`Vendors (${filteredVendors.length})`}
        onTrashVendor={handleTrashVendor}
        onEditVendor={handleEditVendor}
        simplifiedView={simplifiedView}
        enablePagination={false}
      />

      <div className="mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(filteredVendors.length / itemsPerPage)}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

      <VendorForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isSubmitting}
        initialData={initialFormData}
        isEditing={!!editingVendor}
      />
    </div>
  );
};

export default Vendors;
