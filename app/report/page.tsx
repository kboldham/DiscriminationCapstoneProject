"use client";

import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="border rounded-xl shadow-lg p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-6">Contact Us</h2>

        <form className="flex flex-col gap-4">
          <input
            className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
