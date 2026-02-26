export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto mt-10 px-4 pb-10 space-y-6">
      <div className="border border-indigo-200 rounded-2xl shadow-sm p-8 bg-white">
        <p className="text-sm font-semibold text-indigo-700 mb-2">Who We Are</p>
        <h1 className="text-3xl font-semibold mb-3 text-slate-900">About SpeakEqual</h1>
        <p className="text-slate-600 text-lg">
          SpeakEqual is a community-focused project built around fairness, accountability, and access to support in Durham, NC.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="border border-indigo-200 rounded-xl shadow-sm p-6 bg-white">
          <h2 className="text-xl font-semibold mb-3 text-indigo-700">Our Mission</h2>
          <p className="text-slate-600 leading-relaxed text-base">
            To empower people to stand against discrimination by providing accessible tools, clear guidance, and community support.
          </p>
        </div>

        <div className="border border-teal-200 rounded-xl shadow-sm p-6 bg-white">
          <h2 className="text-xl font-semibold mb-3 text-teal-700">Who We Serve</h2>
          <p className="text-slate-600 leading-relaxed text-base">
            We serve individuals and families facing discrimination in housing, employment, and public accommodations by creating a trusted
            space for documentation and advocacy.
          </p>
        </div>
      </div>

      <div className="border border-amber-200 rounded-xl shadow-sm p-8 bg-white">
        <h2 className="text-2xl font-semibold mb-3 text-amber-700">Why We Built SpeakEqual</h2>
        <p className="text-slate-600 leading-relaxed text-base">
          Reporting discrimination can feel overwhelming and isolating. SpeakEqual makes the process easier,
          reduces friction, and helps people move from uncertainty to informed action.
        </p>
      </div>

      <div className="border border-slate-200 rounded-xl shadow-sm p-8 bg-slate-50">
        <h2 className="text-2xl font-semibold mb-3 text-indigo-700">Our Community Commitment</h2>
        <p className="text-slate-600 leading-relaxed text-base">
          Beyond individual reports, we are committed to community education and long-term change. We share patterns and insights with
          local leaders to support transparency, collaboration, and stronger responses to discrimination across Durham.
        </p>
      </div>
    </div>
  );
}
