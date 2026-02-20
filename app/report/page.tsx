"use client";

import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [discriminationType, setDiscriminationType] = useState("");
  const [customType, setCustomType] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isEstimatedTime, setIsEstimatedTime] = useState(false);
  const [info, setInfo] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const errors = [];

    // Validate all fields
    if (!name.trim()) {
      errors.push("Full Name");
    }

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

    if (!info.trim()) {
      errors.push("Discrimination Details");
    }

    if (errors.length > 0) {
      setError(`Please fill out the following required fields: ${errors.join(", ")}`);
      return;
    }

    // If all validation passes, you can submit
    console.log("Form submitted:", { name, discriminationType, customType, location, date, time, isEstimatedTime, info });
    alert("Report submitted successfully!");
    // Reset form
    setName("");
    setDiscriminationType("");
    setCustomType("");
    setLocation("");
    setDate("");
    setTime("");
    setIsEstimatedTime(false);
    setInfo("");
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="border rounded-xl shadow-lg p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-6">Report Discrimination</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <p>Enter your Full Name *</p>
          <input
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <p>Discrimination Type *</p>
          <select
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe the type of discrimination"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
              />
            </>
          )}

          <p>Location of Incident *</p>
          <input
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the location where the incident occurred"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <p>Date of Incident *</p>
          <input
            type="date"
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <p>Time of Incident *</p>
          <input
            type="time"
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <p>Enter your Discrimination Details *</p>
          <textarea
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Describe in detail what happened during the incident"
            rows="6"
            value={info}
            onChange={(e) => setInfo(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white rounded-md p-3 hover:bg-blue-700 transition"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
