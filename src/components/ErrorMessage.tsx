import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center my-6 shadow-sm max-w-lg mx-auto">
      <div className="inline-flex p-2.5 rounded-full bg-neutral-100 text-neutral-800 mb-3">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 tracking-tight">
        Failed to load portfolio data
      </h3>
      <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center space-x-2 text-xs font-medium px-3.5 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white transition cursor-pointer"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
