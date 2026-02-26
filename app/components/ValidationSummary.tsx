"use client";

interface ValidationSummaryProps {
  missingFields: string[];
  onClose: () => void;
}

export default function ValidationSummary({ missingFields, onClose }: ValidationSummaryProps) {
  return (
    <div className="bg-amber-50 border border-amber-200 p-4 mb-6 rounded-lg">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-amber-700 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-amber-900 mb-2">Required Fields Missing</h3>
            <ul className="space-y-1">
              {missingFields.map((field, index) => (
                <li key={index} className="text-sm text-amber-800">
                  • {field}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-amber-700 hover:text-amber-900 ml-2 flex-shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
