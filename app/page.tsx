export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Welcome</h1>
      
      <div className="border rounded-lg shadow-md p-6 bg-white mb-6">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-gray-700">
          We help individuals living in Durham, North Carolina identify, document, and take action against discrimination in housing, employment, and public spaces.
        </p>
      </div>

      <div className="border rounded-lg shadow-md p-6 bg-white mb-6">
        <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
        <p className="text-gray-700">
          By leveraging an AI-driven tool that assists users in reporting incidents of discrimination, providing access to support services and informing them of their potential actions to take; we seek to foster a more transparent, accountable, and equitable Durham community.
        </p>
      </div>

      <div className="border rounded-lg shadow-md p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Get Started</h2>
        <p className="text-gray-700">
          [Additional content can be added here]
        </p>
      </div>
    </div>
  );
}
