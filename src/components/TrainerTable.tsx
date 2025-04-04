import React from "react";
import { useState } from "react";

type Trainers = {
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
};

interface TrainerTableProps {
  Trainers: Trainers[];
  title: string;
}

interface ResumeModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

// ⭐ NEW ADDITION: Resume Modal Component
const ResumeModal: React.FC<ResumeModalProps> = ({ url, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getEmbedUrl = (url: string) => {
    if (url.includes("drive.google.com")) {
      return url.replace("/view?usp=sharing", "/preview");
    }
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-[90%] h-[90%] relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-600 hover:text-gray-800"
        >
          ✕
        </button>
        <iframe
          src={getEmbedUrl(url)}
          className="w-full h-full rounded-md"
          title="Resume Preview"
          allow="autoplay"
        />
      </div>
    </div>
  );
};

const TrainersTable: React.FC<TrainerTableProps> = ({ Trainers, title }) => {
  const [selectedResume, setSelectedResume] = useState<string | null>(null);
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Qualification</th>
              <th className="px-6 py-3 font-medium">Expertise</th>
              <th className="px-6 py-3 font-medium">Total years of teaching</th>
              <th className="px-6 py-3 font-medium">Resume</th>
              <th className="px-6 py-3 font-medium">Contact no</th>
              <th className="px-6 py-3 font-medium">email</th>
              <th className="px-6 py-3 font-medium">passing years</th>
              <th className="px-6 py-3 font-medium">Teaching experience</th>
              <th className="px-6 py-3 font-medium">Development experience</th>
              <th className="px-6 py-3 font-medium">Feasible time</th>
              <th className="px-6 py-3 font-medium">Expected payout</th>
              <th className="px-6 py-3 font-medium">Location</th>
              <th className="px-6 py-3 font-medium">Remarks</th>
              <th className="px-6 py-3 font-medium">Interview</th>
            </tr>
          </thead>
          <tbody>
            {Trainers.map((trainer) => (
              <tr>
                <td className="px-6 py-4">{trainer.name}</td>
                <td className="px-6 py-4">{trainer.qualification}</td>
                <td className="px-6 py-4">{trainer.expertise}</td>
                <td className="px-6 py-4">{trainer.totalExperience}</td>
                <td className="px-6 py-4">
                  {trainer.resume ? (
                    <button
                      onClick={() =>
                        setSelectedResume(
                          typeof trainer.resume === "string"
                            ? trainer.resume
                            : null
                        )
                      }
                      className="text-blue-500 hover:text-blue-700 underline"
                    >
                      View Resume
                    </button>
                  ) : (
                    "No file uploaded"
                  )}
                </td>

                <td className="px-6 py-4">{trainer.phoneNo}</td>
                <td className="px-6 py-4">{trainer.email}</td>
                <td className="px-6 py-4">{trainer.passingYear}</td>
                <td className="px-6 py-4">{trainer.teachingExperience}</td>
                <td className="px-6 py-4">{trainer.developmentExperience}</td>
                <td className="px-6 py-4">{trainer.feasibleTime}</td>
                <td className="px-6 py-4">{trainer.payoutExpectation}</td>
                <td className="px-6 py-4">{trainer.location}</td>
                <td className="px-6 py-4">{trainer.remarks}</td>
                <td className="px-6 py-4">
                  {trainer.interview ? (
                    <span
                      className={`px-3 py-1.5 rounded-md font-medium text-sm ${
                        trainer.interview === "Taken"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {trainer.interview}
                    </span>
                  ) : (
                    "Not taken"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ResumeModal
        url={selectedResume || ""}
        isOpen={!!selectedResume}
        onClose={() => setSelectedResume(null)}
      />
    </div>
  );
};

export default TrainersTable;
