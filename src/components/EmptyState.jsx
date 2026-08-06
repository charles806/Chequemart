import { PackageOpen } from "lucide-react";

const EmptyState = ({ icon, title = "No data found", description = "", actionLabel, actionLink, onAction }) => {
  const Icon = icon || PackageOpen;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Icon className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-gray-400 max-w-sm mb-6">{description}</p>}
      {actionLabel && (onAction || actionLink) && (
        actionLink ? (
          <a
            href={actionLink}
            className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-red-600 transition"
          >
            {actionLabel}
          </a>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center px-5 py-2.5 bg-primary text-white rounded-md text-sm font-medium hover:bg-red-600 transition"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
