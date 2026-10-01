import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="bg-rose-950/30 border border-rose-800/50 rounded-xl p-6 text-center my-6">
      <div className="inline-flex p-3 rounded-full bg-rose-500/10 text-rose-400 mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-bold text-white tracking-tight">
        Failed to load portfolio data
      </h3>
      <p className="text-xs text-rose-300/80 mt-1 max-w-md mx-auto">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="mt-4 inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition cursor-pointer"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        <span>Try Again</span>
      </button>
    </div>
  );
}
