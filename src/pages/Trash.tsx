import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

interface DeletedTrainer {
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
  trashedAt: string;
}

interface DeletedClient {
  name: string;
  email: string;
}

interface DeletedCourse {
  name: string;
  description: string;
}

interface DeletedVendor {
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
  trashedAt: string;
}

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  action: string;
}

// Confirmation Modal Component
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
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
          Are you sure you want to restore{" "}
          <span className="font-medium text-gray-700">{itemName}</span>? This
          item will be moved back to the active trainers list.
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
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            Restore
          </button>
        </div>
      </div>
    </div>
  );
};

const Trash: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [deletedTrainers, setDeletedTrainers] = useState<DeletedTrainer[]>([]);
  const [deletedClients] = useState<DeletedClient[]>([]);
  const [deletedCourses] = useState<DeletedCourse[]>([]);
  const [deletedVendors, setDeletedVendors] = useState<DeletedVendor[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    trainer: DeletedTrainer | null;
    vendor: DeletedVendor | null;
    action: string;
  }>({
    isOpen: false,
    trainer: null,
    vendor: null,
    action: "",
  });

  // Pagination states
  const [trainerCurrentPage, setTrainerCurrentPage] = useState(1);
  const [trainerItemsPerPage, setTrainerItemsPerPage] = useState(10);
  const [paginatedTrainers, setPaginatedTrainers] = useState<DeletedTrainer[]>(
    []
  );

  const [clientCurrentPage, setClientCurrentPage] = useState(1);
  const [clientItemsPerPage, setClientItemsPerPage] = useState(10);
  const [paginatedClients, setPaginatedClients] = useState<DeletedClient[]>([]);

  const [courseCurrentPage, setCourseCurrentPage] = useState(1);
  const [courseItemsPerPage, setCourseItemsPerPage] = useState(10);
  const [paginatedCourses, setPaginatedCourses] = useState<DeletedCourse[]>([]);

  // Vendor pagination states
  const [vendorCurrentPage, setVendorCurrentPage] = useState(1);
  const [vendorItemsPerPage, setVendorItemsPerPage] = useState(10);
  const [paginatedVendors, setPaginatedVendors] = useState<DeletedVendor[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Load trashed trainers from localStorage
    const trashedTrainers = JSON.parse(
      localStorage.getItem("trashedTrainers") || "[]"
    );
    setDeletedTrainers(trashedTrainers);

    // Load trashed vendors from localStorage
    const trashedVendors = JSON.parse(
      localStorage.getItem("trashedVendors") || "[]"
    );
    setDeletedVendors(trashedVendors);
  }, []);

  // Load saved pagination preferences
  useEffect(() => {
    // Load trainer items per page
    const savedTrainerItemsPerPage = localStorage.getItem(
      "trashTrainerItemsPerPage"
    );
    if (savedTrainerItemsPerPage) {
      setTrainerItemsPerPage(Number(savedTrainerItemsPerPage));
    }

    // Load client items per page
    const savedClientItemsPerPage = localStorage.getItem(
      "trashClientItemsPerPage"
    );
    if (savedClientItemsPerPage) {
      setClientItemsPerPage(Number(savedClientItemsPerPage));
    }

    // Load course items per page
    const savedCourseItemsPerPage = localStorage.getItem(
      "trashCourseItemsPerPage"
    );
    if (savedCourseItemsPerPage) {
      setCourseItemsPerPage(Number(savedCourseItemsPerPage));
    }

    // Load vendor items per page
    const savedVendorItemsPerPage = localStorage.getItem(
      "trashVendorItemsPerPage"
    );
    if (savedVendorItemsPerPage) {
      setVendorItemsPerPage(Number(savedVendorItemsPerPage));
    }
  }, []);

  // Calculate pagination for trainers
  useEffect(() => {
    const startIndex = (trainerCurrentPage - 1) * trainerItemsPerPage;
    const endIndex = startIndex + trainerItemsPerPage;
    setPaginatedTrainers(deletedTrainers.slice(startIndex, endIndex));

    // Reset to page 1 if current page is invalid
    if (
      trainerCurrentPage >
        Math.ceil(deletedTrainers.length / trainerItemsPerPage) &&
      deletedTrainers.length > 0
    ) {
      setTrainerCurrentPage(1);
    }
  }, [deletedTrainers, trainerCurrentPage, trainerItemsPerPage]);

  // Calculate pagination for clients
  useEffect(() => {
    const startIndex = (clientCurrentPage - 1) * clientItemsPerPage;
    const endIndex = startIndex + clientItemsPerPage;
    setPaginatedClients(deletedClients.slice(startIndex, endIndex));
  }, [deletedClients, clientCurrentPage, clientItemsPerPage]);

  // Calculate pagination for courses
  useEffect(() => {
    const startIndex = (courseCurrentPage - 1) * courseItemsPerPage;
    const endIndex = startIndex + courseItemsPerPage;
    setPaginatedCourses(deletedCourses.slice(startIndex, endIndex));
  }, [deletedCourses, courseCurrentPage, courseItemsPerPage]);

  // Calculate pagination for vendors
  useEffect(() => {
    const startIndex = (vendorCurrentPage - 1) * vendorItemsPerPage;
    const endIndex = startIndex + vendorItemsPerPage;
    setPaginatedVendors(deletedVendors.slice(startIndex, endIndex));

    // Reset to page 1 if current page is invalid
    if (
      vendorCurrentPage >
        Math.ceil(deletedVendors.length / vendorItemsPerPage) &&
      deletedVendors.length > 0
    ) {
      setVendorCurrentPage(1);
    }
  }, [deletedVendors, vendorCurrentPage, vendorItemsPerPage]);

  // Get total pages
  const trainerTotalPages = Math.max(
    1,
    Math.ceil(deletedTrainers.length / trainerItemsPerPage)
  );
  const clientTotalPages = Math.max(
    1,
    Math.ceil(deletedClients.length / clientItemsPerPage)
  );
  const courseTotalPages = Math.max(
    1,
    Math.ceil(deletedCourses.length / courseItemsPerPage)
  );
  const vendorTotalPages = Math.max(
    1,
    Math.ceil(deletedVendors.length / vendorItemsPerPage)
  );

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const openRestoreConfirmation = (trainer: DeletedTrainer) => {
    setConfirmationModal({
      isOpen: true,
      trainer: trainer,
      vendor: null,
      action: "Restore",
    });
  };

  const handleRestoreTrainer = () => {
    if (!confirmationModal.trainer) return;

    const trainer = confirmationModal.trainer;

    // Remove from trashed trainers using ID for reliable identification
    const updatedTrashedTrainers = deletedTrainers.filter(
      (t) => t.id !== trainer.id
    );

    setDeletedTrainers(updatedTrashedTrainers);
    localStorage.setItem(
      "trashedTrainers",
      JSON.stringify(updatedTrashedTrainers)
    );

    // Get current trainers from localStorage or initialize empty array
    const currentTrainers = JSON.parse(
      localStorage.getItem("trainers") || "[]"
    );

    // Add the trainer back to active trainers (without the trashedAt property)
    const { trashedAt, ...trainerData } = trainer;

    // Ensure the trainer has an ID
    if (!trainerData.id) {
      trainerData.id = "restored-" + new Date().getTime();
    }

    currentTrainers.push(trainerData);
    localStorage.setItem("trainers", JSON.stringify(currentTrainers));

    // Show success message
    setSuccess(`Trainer "${trainer.name}" has been restored.`);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  // Add handlers for items per page changes
  const handleTrainerItemsPerPageChange = (newValue: number) => {
    setTrainerItemsPerPage(newValue);
    setTrainerCurrentPage(1);
    localStorage.setItem("trashTrainerItemsPerPage", newValue.toString());
  };

  const handleClientItemsPerPageChange = (newValue: number) => {
    setClientItemsPerPage(newValue);
    setClientCurrentPage(1);
    localStorage.setItem("trashClientItemsPerPage", newValue.toString());
  };

  const handleCourseItemsPerPageChange = (newValue: number) => {
    setCourseItemsPerPage(newValue);
    setCourseCurrentPage(1);
    localStorage.setItem("trashCourseItemsPerPage", newValue.toString());
  };

  const openRestoreVendorConfirmation = (vendor: DeletedVendor) => {
    setConfirmationModal({
      isOpen: true,
      trainer: null,
      vendor: vendor,
      action: "Restore",
    });
  };

  const handleRestoreVendor = () => {
    if (!confirmationModal.vendor) return;

    const vendor = confirmationModal.vendor;

    // Remove from trashed vendors using ID for reliable identification
    const updatedTrashedVendors = deletedVendors.filter(
      (v) => v.id !== vendor.id
    );

    setDeletedVendors(updatedTrashedVendors);
    localStorage.setItem(
      "trashedVendors",
      JSON.stringify(updatedTrashedVendors)
    );

    // Get current vendors from localStorage or initialize empty array
    const currentVendors = JSON.parse(localStorage.getItem("vendors") || "[]");

    // Add the vendor back to active vendors (without the trashedAt property)
    const { trashedAt, ...vendorData } = vendor;

    // Ensure the vendor has an ID
    if (!vendorData.id) {
      vendorData.id = "restored-" + new Date().getTime();
    }

    currentVendors.push(vendorData);
    localStorage.setItem("vendors", JSON.stringify(currentVendors));

    // Show success message
    setSuccess(`Vendor "${vendor.name}" has been restored.`);

    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccess(null);
    }, 3000);
  };

  const handleVendorItemsPerPageChange = (newValue: number) => {
    setVendorItemsPerPage(newValue);
    setVendorCurrentPage(1);
    localStorage.setItem("trashVendorItemsPerPage", newValue.toString());
  };

  const handleConfirmAction = () => {
    if (confirmationModal.trainer) {
      handleRestoreTrainer();
    } else if (confirmationModal.vendor) {
      handleRestoreVendor();
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trash</h1>

      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-md">
          {success}
        </div>
      )}

      <div className="space-y-4">
        {/* Trainers Section */}
        <div
          onClick={() => toggleSection("trainers")}
          className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg border"
        >
          <h2 className="text-lg font-semibold">View removed Trainers</h2>
          {deletedTrainers.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
              {deletedTrainers.length}
            </span>
          )}
        </div>

        {activeSection === "trainers" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Expertise</th>
                    <th className="px-6 py-3 font-medium">Trashed At</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTrainers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No trainers in trash
                      </td>
                    </tr>
                  ) : (
                    paginatedTrainers.map((trainer, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{trainer.name}</td>
                        <td className="px-6 py-4">{trainer.email}</td>
                        <td className="px-6 py-4">{trainer.expertise}</td>
                        <td className="px-6 py-4">
                          {new Date(trainer.trashedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => openRestoreConfirmation(trainer)}
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add pagination for trainers */}
            {deletedTrainers.length > 0 && (
              <Pagination
                currentPage={trainerCurrentPage}
                totalPages={trainerTotalPages}
                onPageChange={setTrainerCurrentPage}
                itemsPerPage={trainerItemsPerPage}
                onItemsPerPageChange={handleTrainerItemsPerPageChange}
                totalItems={deletedTrainers.length}
              />
            )}
          </div>
        )}

        {/* Vendors Section */}
        <div
          onClick={() => toggleSection("vendors")}
          className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg border"
        >
          <h2 className="text-lg font-semibold">View removed Vendors</h2>
          {deletedVendors.length > 0 && (
            <span className="ml-2 px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">
              {deletedVendors.length}
            </span>
          )}
        </div>

        {activeSection === "vendors" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Company</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Location</th>
                    <th className="px-6 py-3 font-medium">Trashed At</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedVendors.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No vendors in trash
                      </td>
                    </tr>
                  ) : (
                    paginatedVendors.map((vendor, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{vendor.name}</td>
                        <td className="px-6 py-4">{vendor.company}</td>
                        <td className="px-6 py-4">{vendor.email}</td>
                        <td className="px-6 py-4">{vendor.location}</td>
                        <td className="px-6 py-4">
                          {new Date(vendor.trashedAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              openRestoreVendorConfirmation(vendor)
                            }
                            className="text-blue-500 hover:text-blue-700 mr-2"
                          >
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add pagination for vendors */}
            {deletedVendors.length > 0 && (
              <Pagination
                currentPage={vendorCurrentPage}
                totalPages={vendorTotalPages}
                onPageChange={setVendorCurrentPage}
                itemsPerPage={vendorItemsPerPage}
                onItemsPerPageChange={handleVendorItemsPerPageChange}
                totalItems={deletedVendors.length}
              />
            )}
          </div>
        )}

        {/* Clients Section */}
        <div
          onClick={() => toggleSection("clients")}
          className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg border"
        >
          <h2 className="text-lg font-semibold">View removed Clients</h2>
        </div>

        {activeSection === "clients" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedClients.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No clients in trash
                      </td>
                    </tr>
                  ) : (
                    paginatedClients.map((client, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{client.name}</td>
                        <td className="px-6 py-4">{client.email}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-500 hover:text-blue-700">
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add pagination for clients */}
            {deletedClients.length > 0 && (
              <Pagination
                currentPage={clientCurrentPage}
                totalPages={clientTotalPages}
                onPageChange={setClientCurrentPage}
                itemsPerPage={clientItemsPerPage}
                onItemsPerPageChange={handleClientItemsPerPageChange}
                totalItems={deletedClients.length}
              />
            )}
          </div>
        )}

        {/* Courses Section */}
        <div
          onClick={() => toggleSection("courses")}
          className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg border"
        >
          <h2 className="text-lg font-semibold">View removed Courses</h2>
        </div>

        {activeSection === "courses" && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Description</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedCourses.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No courses in trash
                      </td>
                    </tr>
                  ) : (
                    paginatedCourses.map((course, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">{course.name}</td>
                        <td className="px-6 py-4">{course.description}</td>
                        <td className="px-6 py-4">
                          <button className="text-blue-500 hover:text-blue-700">
                            Restore
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Add pagination for courses */}
            {deletedCourses.length > 0 && (
              <Pagination
                currentPage={courseCurrentPage}
                totalPages={courseTotalPages}
                onPageChange={setCourseCurrentPage}
                itemsPerPage={courseItemsPerPage}
                onItemsPerPageChange={handleCourseItemsPerPageChange}
                totalItems={deletedCourses.length}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() =>
          setConfirmationModal((prev) => ({ ...prev, isOpen: false }))
        }
        onConfirm={handleConfirmAction}
        itemName={
          confirmationModal.trainer?.name ||
          confirmationModal.vendor?.name ||
          ""
        }
        action={confirmationModal.action}
      />
    </div>
  );
};

export default Trash;
