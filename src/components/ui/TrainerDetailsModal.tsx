import React from "react";
import ExcelJS from "exceljs";

const TrainerDetailsModal = ({ isOpen, status, onClose, trainers }) => {
  if (!isOpen) return null;

  const handleDownloadExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Trainers");

    // Define column headers
    worksheet.columns = [
      { header: "Name", key: "name", width: 30 },
      { header: "Status", key: "status", width: 20 },
      { header: "Interview Date", key: "interviewDate", width: 15 },
    ];

    // Add rows to the sheet
    trainers.forEach((trainer) => {
      worksheet.addRow({
        name: trainer.name,
        status: trainer.status,
        interviewDate: trainer.interviewDate,
      });
    });

    // Write the Excel file to the browser
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);

    // Create a download link and trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${status.replace(" ", "_")}_trainers.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url); // Clean up the URL object
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-4xl">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-black text-xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-4">{status} Details</h2>
        <table className="min-w-full table-auto mb-4">
          <thead>
            <tr>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Interview Date</th>
            </tr>
          </thead>
          <tbody>
            {trainers.map((trainer, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{trainer.name}</td>
                <td className="border px-4 py-2">{trainer.status}</td>
                <td className="border px-4 py-2">{trainer.interviewDate}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Download Excel Button */}
        <button
          onClick={handleDownloadExcel}
          className="mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Download as Excel
        </button>
      </div>
    </div>
  );
};

export default TrainerDetailsModal;
