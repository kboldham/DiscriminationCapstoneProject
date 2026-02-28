"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ValidationSummary from "@/app/components/ValidationSummary";

type FollowUpPreference = "contact" | "anonymous";

export default function ReportPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [followUpPreference, setFollowUpPreference] = useState<FollowUpPreference>("anonymous");
  const [discriminationType, setDiscriminationType] = useState("");
  const [customType, setCustomType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isEstimatedTime, setIsEstimatedTime] = useState(false);
  const [personsInvolved, setPersonsInvolved] = useState("");
  const [info, setInfo] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileList | null>(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasAutoPopulated, setHasAutoPopulated] = useState(false);

  const steps = [
    "Contact Info & Follow-Up",
    "Discrimination Type",
    "Incident Location",
    "Incident Date & Time",
    "People Involved",
    "Incident Details",
    "Supporting Documents",
    "Review & Submit",
  ];

  const isLastStep = currentStep === steps.length - 1;
  const progressPercent = Math.round(((currentStep + 1) / steps.length) * 100);

  useEffect(() => {
    if (status !== "authenticated" || hasAutoPopulated) {
      return;
    }

    if (!name && session.user?.name) {
      setName(session.user.name);
    }

    if (!email && session.user?.email) {
      setEmail(session.user.email);
      setFollowUpPreference("contact");
    }

    setHasAutoPopulated(true);
  }, [status, session, name, email, hasAutoPopulated]);

  const validateCurrentStep = () => {
    const errors: string[] = [];

    if (currentStep === 0) {
      if (followUpPreference === "contact" && !email.trim()) {
        errors.push("Email Address (required for follow-up)");
      }
    }

    if (currentStep === 1) {
      if (!discriminationType) {
        errors.push("Discrimination Type");
      }

      if (discriminationType === "other" && !customType.trim()) {
        errors.push("Specific Discrimination Type");
      }
    }

    if (currentStep === 2 && !location.trim()) {
      errors.push("Location of Incident");
    }

    if (currentStep === 3) {
      if (!date) {
        errors.push("Date of Incident");
      }

      if (!time && !isEstimatedTime) {
        errors.push("Time of Incident (or check Estimated Time)");
      }
    }

    if (currentStep === 4 && !personsInvolved.trim()) {
      errors.push("Person(s) Involved");
    }

    if (currentStep === 5 && !info.trim()) {
      errors.push("Discrimination Details");
    }

    return errors;
  };

  const validateAllRequiredFields = () => {
    const errors: string[] = [];

    if (!discriminationType) {
      errors.push("Discrimination Type");
    }

    if (discriminationType === "other" && !customType.trim()) {
      errors.push("Specific Discrimination Type");
    }

    if (!location.trim()) {
      errors.push("Location of Incident");
    }

    if (!date) {
      errors.push("Date of Incident");
    }

    if (!time && !isEstimatedTime) {
      errors.push("Time of Incident (or check Estimated Time)");
    }

    if (!personsInvolved.trim()) {
      errors.push("Person(s) Involved");
    }

    if (!info.trim()) {
      errors.push("Discrimination Details");
    }

    if (followUpPreference === "contact" && !email.trim()) {
      errors.push("Email Address (required for follow-up)");
    }

    return errors;
  };

  const handleNext = () => {
    const errors = validateCurrentStep();

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    setShowValidationModal(false);
    setValidationErrors([]);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setShowValidationModal(false);
    setValidationErrors([]);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");
    const errors = validateAllRequiredFields();

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }

    setIsSubmitting(true);

    const response = await fetch("/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        followUpPreference,
        discriminationType,
        customType,
        location,
        date,
        time,
        isEstimatedTime,
        personsInvolved,
        info,
        uploadedFileNames: uploadedFiles ? Array.from(uploadedFiles).map((file) => file.name) : [],
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      setError(data.error || "Unable to submit report right now.");
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("Your report has been submitted. Thank you for speaking up.");

    // Reset form
    setName(session?.user?.name || "");
    setEmail(session?.user?.email || "");
    setFollowUpPreference(session?.user?.email ? "contact" : "anonymous");
    setDiscriminationType("");
    setCustomType("");
    setLocation("");
    setDate("");
    setTime("");
    setIsEstimatedTime(false);
    setPersonsInvolved("");
    setInfo("");
    setUploadedFiles(null);
    setCurrentStep(0);
    setIsSubmitting(false);
  };

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-4">
          <div>
            <p className="mb-2">Email Address (Optional unless you request follow-up)</p>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <p className="text-sm text-slate-600">Would you like follow-up updates?</p>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="followUp"
              checked={followUpPreference === "contact"}
              onChange={() => setFollowUpPreference("contact")}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-600">Yes, contact me (requires an email or account).</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="followUp"
              checked={followUpPreference === "anonymous"}
              onChange={() => setFollowUpPreference("anonymous")}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-600">No, keep this report anonymous.</span>
          </label>

          <div>
            <p className="mb-2">Full Name (Optional)</p>
            <input
              className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      );
    }

    if (currentStep === 1) {
      return (
        <div className="space-y-4">
          <p>What type of discrimination occurred? *</p>
          <select
            className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={discriminationType}
            onChange={(e) => setDiscriminationType(e.target.value)}
          >
            <option value="">Select a type</option>
            <option value="housing">Housing</option>
            <option value="employment">Employment</option>
            <option value="public">Public Accommodations</option>
            <option value="other">Other</option>
          </select>

          {discriminationType === "other" && (
            <div>
              <p className="mb-2">Specify the discrimination type *</p>
              <input
                className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Describe the discrimination type"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            </div>
          )}
        </div>
      );
    }

    if (currentStep === 2) {
      return (
        <div className="space-y-4">
          <p>Where did this happen? *</p>
          <input
            className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter the incident location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      );
    }

    if (currentStep === 3) {
      return (
        <div className="space-y-4">
          <div>
            <p className="mb-2">Incident Date *</p>
            <input
              type="date"
              className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <p className="mb-2">Incident Time *</p>
            <input
              type="time"
              className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isEstimatedTime}
              onChange={(e) => setIsEstimatedTime(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-slate-600">I don&apos;t know the exact time (use an estimate).</span>
          </label>
        </div>
      );
    }

    if (currentStep === 4) {
      return (
        <div className="space-y-4">
          <p>Who was involved? *</p>
          <input
            className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter names or descriptions of the people involved"
            value={personsInvolved}
            onChange={(e) => setPersonsInvolved(e.target.value)}
          />
        </div>
      );
    }

    if (currentStep === 5) {
      return (
        <div className="space-y-4">
          <p>Describe what happened. *</p>
          <textarea
            className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Describe what happened in as much detail as possible"
            rows={7}
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />
        </div>
      );
    }

    if (currentStep === 6) {
      return (
        <div className="space-y-4">
          <p className="font-medium">Upload Supporting Documents (Optional)</p>
          <p className="text-sm text-slate-600">
            Upload relevant files such as emails, photos, screenshots, contracts, or other supporting documentation.
          </p>
          <input
            type="file"
            multiple
            onChange={(e) => setUploadedFiles(e.target.files)}
            className="w-full border border-slate-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {uploadedFiles && uploadedFiles.length > 0 && (
            <div className="text-sm text-slate-600 mt-2">
              <p className="font-medium mb-1">Selected files ({uploadedFiles.length}):</p>
              <ul className="list-disc pl-5">
                {Array.from(uploadedFiles).map((file, index) => (
                  <li key={index}>
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="font-semibold">Review Your Report Before Submitting</p>
        <div className="grid gap-3 text-sm">
          <div>
            <p className="font-medium">Full Name</p>
            <p className="text-slate-600">{name || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <p className="text-slate-600">{email || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium">Follow-up Preference</p>
            <p className="text-slate-600">{followUpPreference === "contact" ? "Contact me" : "Anonymous"}</p>
          </div>
          <div>
            <p className="font-medium">Discrimination Type</p>
            <p className="text-slate-600">
              {discriminationType || "Not provided"}
              {discriminationType === "other" && customType ? ` (${customType})` : ""}
            </p>
          </div>
          <div>
            <p className="font-medium">Location</p>
            <p className="text-slate-600">{location || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium">Date</p>
            <p className="text-slate-600">{date || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium">Time</p>
            <p className="text-slate-600">{time || (isEstimatedTime ? "Estimated time" : "Not provided")}</p>
          </div>
          <div>
            <p className="font-medium">Person(s) Involved</p>
            <p className="text-slate-600">{personsInvolved || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium">Incident Details</p>
            <p className="text-slate-600 whitespace-pre-wrap">{info || "Not provided"}</p>
          </div>
          <div>
            <p className="font-medium">Supporting Files</p>
            <p className="text-slate-600">
              {uploadedFiles && uploadedFiles.length > 0
                ? `${uploadedFiles.length} file(s) selected`
                : "No files selected"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 pb-10">
      <div className="space-y-5">
          <div className="border border-indigo-300 rounded-xl shadow-sm p-6 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-100 mb-2">Guided Incident Form</p>
            <h2 className="text-2xl font-semibold mb-2">Submit a Report</h2>
            <p className="text-indigo-50 leading-relaxed">
              Complete one step at a time. You can go back and review everything before submitting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 border-indigo-200 bg-indigo-50 shadow-sm h-full">
              <p className="font-semibold text-lg text-indigo-800">Report Status</p>
              {status === "authenticated" ? (
                <>
                  <p className="text-sm text-slate-700 mt-2 mb-1 leading-relaxed">
                    You are signed in as <span className="font-semibold">{session?.user?.email}</span>.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Your account details are auto-filled where applicable.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-slate-700 mt-2 mb-1 leading-relaxed">
                    Use the <span className="font-semibold">Sign In / Sign Up</span> tab to save drafts and receive secure updates.
                  </p>
                  <p className="text-sm text-slate-700 leading-relaxed">You can also continue this report anonymously.</p>
                </>
              )}
            </div>

            <div className="bg-teal-100 border border-teal-300 text-teal-900 px-4 py-4 rounded shadow-sm h-full">
              <p className="font-semibold">Your safety and privacy come first.</p>
              <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
                <li>Anonymous reports are accepted and reviewed.</li>
                <li>If you choose to create an account, your information is used only for report management and follow-up.</li>
              </ul>
            </div>
          </div>

          <div className="border border-indigo-200 rounded-xl shadow-sm p-6 bg-white">
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <span>{progressPercent}% complete</span>
              </div>
              <div className="w-full bg-indigo-100 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
              </div>
              <p className="mt-3 font-semibold text-slate-900">{steps[currentStep]}</p>
            </div>

            {showValidationModal && (
              <ValidationSummary
                missingFields={validationErrors}
                onClose={() => setShowValidationModal(false)}
              />
            )}

            {successMessage && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p className="font-semibold mb-1">Report Submitted</p>
                <p>{successMessage}</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="rounded-lg border border-indigo-200 p-5 bg-indigo-50/70 mb-6">
              {renderStepContent()}
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStep === 0 || isSubmitting}
                className="px-4 py-2.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 transition disabled:opacity-50 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                Previous
              </button>

              {!isLastStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-indigo-600 text-white rounded-md px-6 py-2.5 hover:bg-indigo-700 transition font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-indigo-600 text-white rounded-md px-6 py-2.5 hover:bg-indigo-700 transition disabled:opacity-60 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
              )}
            </div>
          </div>
      </div>
    </div>
  );
}
