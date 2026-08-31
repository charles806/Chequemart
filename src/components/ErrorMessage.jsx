import { AlertTriangle, RefreshCw } from "lucide-react";

const ErrorMessage = ({ message = "Something went wrong", onRetry, fullPage = false }) => {
  const content = (
    <div role="alert" className="flex flex-col items-center justify-center gap-4 p-8 text-center">
      <AlertTriangle className="h-12 w-12 text-red-400" />
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">Oops!</h3>
        <p className="text-sm text-gray-500 max-w-md">{message}</p>
        <p className="text-xs text-gray-400 mt-2">If this persists, please contact support.</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center bg-[#ff5252] cursor-pointer gap-2 px-4 py-2 bg-primary text-white rounded-md text-sm font-medium transition"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );

  if (fullPage) {
    return <div className="min-h-[60vh] flex items-center justify-center">{content}</div>;
  }

  return content;
};

export default ErrorMessage;
