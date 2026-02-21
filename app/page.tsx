export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Welcome to SpeakEqual</h1>
      <p className="text-gray-700 text-center mb-8">
        A simple place to report discrimination, understand your options, and access support in Durham, NC.
      </p>
      
      <div className="border rounded-lg shadow-md p-6 bg-white mb-6">
        <h2 className="text-2xl font-bold mb-4">Start a Report</h2>
        <p className="text-gray-700">
          Document incidents in housing, employment, and public accommodations through a structured form designed to reduce stress and confusion.
        </p>
      </div>

      <div className="border rounded-lg shadow-md p-6 bg-white mb-6">
        <h2 className="text-2xl font-bold mb-4">Learn Your Next Steps</h2>
        <p className="text-gray-700">
          Use our educational resources to better understand discrimination categories, reporting options, and practical actions you can take next.
        </p>
      </div>

      <div className="border rounded-lg shadow-md p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Track with an Account (Optional)</h2>
        <p className="text-gray-700">
          Create an account only if you want to save drafts and track report updates. Anonymous reporting is always available.
        </p>
      </div>
    </div>
  );
}
