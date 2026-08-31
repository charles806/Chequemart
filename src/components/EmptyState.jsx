import { Link } from "react-router-dom";
import { PackageOpen } from "lucide-react";

const EmptyState = ({ icon, title = "No data found", description = "", actionLabel, actionLink, onAction }) => {
  const Icon = icon || PackageOpen;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
        <Icon className="h-10 w-10 text-neutral-300" />
      </div>
      <h3 className="text-lg font-semibold text-neutral-700 mb-1">{title}</h3>
      {description && <p className="text-sm text-neutral-400 max-w-sm mb-6">{description}</p>}
      {actionLabel && (onAction || actionLink) && (
        actionLink ? (
          <Link
            to={actionLink}
            className="inline-flex items-center px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="inline-flex items-center px-5 py-2.5 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
};

export default EmptyState;
