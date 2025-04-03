import React from "react";

type Trainers = {
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
};

interface TrainerTableProps {
  Trainers: Trainers[];
  title: string;
}

const TrainersTable: React.FC<TrainerTableProps> = ({ Trainers, title }) => {
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
            </tr>
          </thead>
          <tbody>
            {Trainers.map((trainer) => (
              <tr>
                <td className="px-6 py-4">{trainer.name}</td>
                <td className="px-6 py-4">{trainer.qualification}</td>
                <td className="px-6 py-4">{trainer.expertise}</td>
                <td className="px-6 py-4">{trainer.totalExperience}</td>
                <td>
                  {trainer.resume ? trainer.resume.name : "No file uploaded"}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainersTable;
