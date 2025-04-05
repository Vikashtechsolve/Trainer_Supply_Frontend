import React from "react";

type StatusType = "Selected" | "Rejected" | "Pending";

interface StatusBadgeProps {
  status: StatusType;
  onClick?: (newStatus: StatusType) => void;
  clickable?: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  onClick,
  clickable = false,
}) => {
  let bgColor = "";
  let textColor = "";

  switch (status) {
    case "Selected":
      bgColor = "bg-green-100";
      textColor = "text-green-800";
      break;
    case "Rejected":
      bgColor = "bg-red-100";
      textColor = "text-red-800";
      break;
    case "Pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-800";
      break;
    default:
      bgColor = "bg-gray-100";
      textColor = "text-gray-800";
  }

  const handleClick = () => {
    if (!clickable || !onClick) return;

    // Cycle through statuses: Pending -> Selected -> Rejected -> Pending
    const nextStatus: StatusType =
      status === "Pending"
        ? "Selected"
        : status === "Selected"
        ? "Rejected"
        : "Pending";

    onClick(nextStatus);
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor} ${
        clickable ? "cursor-pointer hover:opacity-80" : ""
      }`}
      onClick={handleClick}
      title={
        clickable ? `Click to change status (currently: ${status})` : undefined
      }
    >
      {status}
    </span>
  );
};

export default StatusBadge;
