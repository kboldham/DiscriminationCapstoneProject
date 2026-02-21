export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 pb-10">
      <div className="border rounded-xl shadow-lg p-8 bg-white mb-6">
        <h1 className="text-3xl font-semibold mb-3">About Us</h1>
        <p className="text-gray-700 text-lg">
          SpeakEqual is a community-focused project centered on fairness, accountability, and access to support in Durham, NC.
        </p>
      </div>

      <div className="border rounded-xl shadow-lg p-8 bg-white mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-purple-700">Our Mission</h2>
        <p className="text-gray-700 leading-relaxed text-base">
          To empower people to stand against discrimination by providing accessible tools, clear guidance, and community support.
        </p>
      </div>

      <div className="border rounded-xl shadow-lg p-8 bg-white mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-purple-700">Who We Serve</h2>
        <p className="text-gray-700 leading-relaxed text-base">
          We serve individuals and families facing discrimination in housing, employment, and public accommodations by creating a trusted
          space for documentation and advocacy.
        </p>
      </div>

      <div className="border rounded-xl shadow-lg p-8 bg-white mb-6">
        <h2 className="text-2xl font-semibold mb-3 text-purple-700">Why We Built SpeakEqual</h2>
        <p className="text-gray-700 leading-relaxed text-base">
          Reporting discrimination can feel overwhelming and isolating. We built SpeakEqual to make the process more approachable,
          reduce friction, and help people move from uncertainty toward informed action.
        </p>
      </div>

      <div className="border rounded-xl shadow-lg p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-3 text-purple-700">Our Community Commitment</h2>
        <p className="text-gray-700 leading-relaxed text-base">
          Beyond individual reports, we are committed to community education and long-term change. We share patterns and insights with
          local leaders to support transparency, collaboration, and stronger responses to discrimination across Durham.
        </p>
      </div>
    </div>
  );
}
