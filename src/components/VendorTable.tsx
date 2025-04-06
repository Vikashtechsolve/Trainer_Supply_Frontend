import React from "react";
import { useState, useEffect } from "react";
import Pagination from "./Pagination";
import { MoreVertical } from "lucide-react";
import StatusBadge from "./StatusBadge";

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

interface VendorTableProps {
  vendors: Vendor[];
  title: string;
  onTrashVendor?: (vendor: Vendor) => void;
  onEditVendor?: (vendor: Vendor) => void;
  simplifiedView?: boolean;
  enablePagination?: boolean;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  vendorName: string;
  action: string;
}

// Confirmation Modal Component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  vendorName,
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
          <span className="font-medium text-gray-700">{vendorName}</span> to the
          trash? This item can be restored later.
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

const VendorTable: React.FC<VendorTableProps> = ({
  vendors,
  title,
  onTrashVendor,
  onEditVendor,
  simplifiedView = false,
  enablePagination = true,
}) => {
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    vendor: Vendor | null;
    action: string;
  }>({
    isOpen: false,
    vendor: null,
    action: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [paginatedVendors, setPaginatedVendors] = useState<Vendor[]>([]);

  // Calculate pagination whenever vendors or pagination settings change
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedVendors(vendors.slice(startIndex, endIndex));

    // If current page is now invalid, reset to page 1
    if (
      currentPage > Math.ceil(vendors.length / itemsPerPage) &&
      vendors.length > 0
    ) {
      setCurrentPage(1);
    }
  }, [vendors, currentPage, itemsPerPage]);

  // Get total pages
  const totalPages = Math.max(1, Math.ceil(vendors.length / itemsPerPage));

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page

    // Save preference to localStorage
    localStorage.setItem("vendorTableItemsPerPage", newItemsPerPage.toString());
  };

  // Toggle dropdown menu
  const toggleDropdown = (index: number) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
    }
  };

  // Handle trash click
  const handleTrashClick = (vendor: Vendor) => {
    setConfirmationModal({
      isOpen: true,
      vendor,
      action: "Trash",
    });
  };

  // Handle edit click
  const handleEditClick = (vendor: Vendor) => {
    if (onEditVendor) {
      onEditVendor(vendor);
    }
  };

  // Confirm trash vendor
  const confirmTrashVendor = () => {
    if (confirmationModal.vendor && onTrashVendor) {
      onTrashVendor(confirmationModal.vendor);
    }
  };

  // Handle visit link click
  const handleVisitLink = (link: string) => {
    if (link) {
      window.open(
        link.startsWith("http://") || link.startsWith("https://")
          ? link
          : `https://${link}`,
        "_blank"
      );
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Function to determine the status badge color
  const getStatusBadgeElement = (status: string) => {
    let className = "";

    // Customize this logic based on your status values
    if (status.toLowerCase() === "active") {
      className = "bg-green-100 text-green-800 border-green-400";
    } else if (status.toLowerCase() === "inactive") {
      className = "bg-red-100 text-red-800 border-red-400";
    } else if (status.toLowerCase() === "pending") {
      className = "bg-yellow-100 text-yellow-800 border-yellow-400";
    } else {
      className = "bg-gray-100 text-gray-800 border-gray-400";
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full border ${className}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Number
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Past Relationship
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Link
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Position
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Trainers Supplied
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              {!simplifiedView && (
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Options
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedVendors.map((vendor, index) => (
              <tr key={vendor.id || index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {vendor.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vendor.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vendor.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vendor.phoneNo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vendor.pastRelationship}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vendor.link ? (
                    <button
                      onClick={() => handleVisitLink(vendor.link)}
                      className="text-primary hover:underline text-sm"
                    >
                      Visit Link
                    </button>
                  ) : (
                    <span className="text-sm text-gray-500">No link</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vendor.contactPersonPosition}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadgeElement(vendor.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {vendor.trainerSupplied && vendor.trainerSupplied.length > 0
                      ? vendor.trainerSupplied.join(", ")
                      : "None"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{vendor.location}</div>
                </td>
                {!simplifiedView && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(index);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={18} />
                    </button>
                    {openDropdown === index && (
                      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 w-36 bg-white shadow-lg rounded-md z-10 border border-gray-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(vendor);
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          disabled
                          className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                        >
                          Delete
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrashClick(vendor);
                            setOpenDropdown(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Trash
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enablePagination && (
        <div className="px-6 py-4 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal({
            isOpen: false,
            vendor: null,
            action: "",
          })
        }
        onConfirm={confirmTrashVendor}
        vendorName={confirmationModal.vendor?.name || ""}
        action={confirmationModal.action}
      />
    </div>
  );
};

export default VendorTable;
