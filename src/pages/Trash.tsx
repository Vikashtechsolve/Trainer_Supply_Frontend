import React, { useState } from "react";

interface DeletedTrainer {
  name: string;
  email: string;
}

interface DeletedClient {
  name: string;
  email: string;
}

interface DeletedCourse {
  name: string;
  description: string;
}

const Trash: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [deletedTrainers] = useState<DeletedTrainer[]>([]);
  const [deletedClients] = useState<DeletedClient[]>([]);
  const [deletedCourses] = useState<DeletedCourse[]>([]);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Trash</h1>

      <div className="space-y-4">
        {/* Trainers Section */}
        <div
          onClick={() => toggleSection("trainers")}
          className="cursor-pointer p-4 hover:bg-gray-50 rounded-lg border"
        >
          <h2 className="text-lg font-semibold">View removed Trainers</h2>
        </div>

        {activeSection === "trainers" && (
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
                  {deletedTrainers.map((trainer, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">{trainer.name}</td>
                      <td className="px-6 py-4">{trainer.email}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  {deletedClients.map((client, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">{client.name}</td>
                      <td className="px-6 py-4">{client.email}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
                  {deletedCourses.map((course, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4">{course.name}</td>
                      <td className="px-6 py-4">{course.description}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-500 hover:text-blue-700">
                          Restore
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trash;
