"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FollowUpPreference = "contact" | "anonymous";

export default function ReportPage() {
  const router = useRouter();
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const errors = [];

    // Validate all fields
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

    if (errors.length > 0) {
      setError(`Please fill out the following required fields: ${errors.join(", ")}`);
      return;
    }

    // If all validation passes, you can submit
    console.log("Form submitted:", { name, discriminationType, customType, location, date, time, isEstimatedTime, personsInvolved, info, files: uploadedFiles?.length });
    setSuccessMessage("Your report has been submitted. Thank you for speaking up.");
    // Reset form
    setName("");
    setEmail("");
    setFollowUpPreference("anonymous");
    setDiscriminationType("");
    setCustomType("");
    setLocation("");
    setDate("");
    setTime("");
    setIsEstimatedTime(false);
    setPersonsInvolved("");
    setInfo("");
    setUploadedFiles(null);
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="border rounded-xl shadow-lg p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-2">Submit a Report</h2>
        <p className="text-gray-700 mb-6">
          Start your report below. You can stay anonymous, or sign in if you want to track updates.
        </p>

        <div className="border rounded-lg p-4 border-gray-200 mb-6">
          <p className="font-semibold text-lg">Want to track your report status?</p>
          <p className="text-sm text-gray-700 mb-3">
            Sign in or create an account to save drafts and receive secure follow-up updates.
          </p>
          <button
            type="button"
            onClick={() => router.push("/auth/signin?callbackUrl=/report")}
            className="bg-purple-600 text-white rounded-md px-4 py-2 hover:bg-purple-700 transition"
          >
            Sign In / Sign Up
          </button>
          <p className="text-sm text-gray-700 mt-3">Otherwise, continue with the report form below anonymously.</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 text-purple-800 px-4 py-4 rounded mb-6">
          <p className="font-semibold">Your safety and privacy come first.</p>
          <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
            <li>Anonymous reports are accepted and reviewed.</li>
            <li>If you choose to create an account, your information is used only for report management and follow-up.</li>
          </ul>
        </div>

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

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <h3 className="text-xl font-semibold">Report Details</h3>
          <p className="text-sm text-gray-700">
            Share what happened, when it occurred, and any supporting context you’re comfortable providing.
          </p>

          <p>Enter your Full Name (Optional)</p>
          <input
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <>
            <p>Email Address (Optional unless you request follow-up)</p>
            <input
              type="email"
              className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>

          <p>Discrimination Type *</p>
          <select
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <>
              <p>Please specify the type of discrimination *</p>
              <input
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe the type of discrimination"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            </>
          )}

          <p>Location of Incident *</p>
          <input
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter the location where the incident occurred"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <p>Date of Incident *</p>
          <input
            type="date"
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <p>Time of Incident *</p>
          <input
            type="time"
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isEstimatedTime}
              onChange={(e) => setIsEstimatedTime(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">I don't know the exact time (Estimated)</span>
          </label>

          <p>Person(s) Involved *</p>
          <input
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter the name(s) of the person/people involved or describe them"
            value={personsInvolved}
            onChange={(e) => setPersonsInvolved(e.target.value)}
          />

          <p>Enter your Discrimination Details *</p>
          <textarea
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            placeholder="Describe in detail what happened during the incident"
            rows={6}
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />

          <p className="font-medium">Supporting Documents (Optional)</p>
          <p className="text-sm text-gray-700 mb-2">
            Upload any relevant files such as emails, photos, screenshots, contracts, or other documentation that supports your report.
          </p>
          <input
            type="file"
            multiple
            onChange={(e) => setUploadedFiles(e.target.files)}
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {uploadedFiles && uploadedFiles.length > 0 && (
            <div className="text-sm text-gray-700 mt-2">
              <p className="font-medium mb-1">Selected files ({uploadedFiles.length}):</p>
              <ul className="list-disc pl-5">
                {Array.from(uploadedFiles).map((file, index) => (
                  <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                ))}
              </ul>
            </div>
          )}

          <p className="font-medium">Would you like follow-up on this report?</p>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="followUp"
              checked={followUpPreference === "contact"}
              onChange={() => setFollowUpPreference("contact")}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">Yes, contact me (requires email or account)</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="followUp"
              checked={followUpPreference === "anonymous"}
              onChange={() => setFollowUpPreference("anonymous")}
              className="w-4 h-4"
            />
            <span className="text-sm text-gray-700">No, keep this fully anonymous</span>
          </label>

          <button
            className="bg-purple-600 text-white rounded-md p-3 hover:bg-purple-700 transition"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
