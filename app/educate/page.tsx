export default function Documentation() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="border rounded-2xl shadow-sm p-8 bg-white">
        <p className="text-sm font-semibold text-teal-700 mb-2">Education Center</p>
        <h1 className="text-3xl font-bold mb-3 text-slate-900">Resources</h1>
        <p className="text-slate-600">Find guidance, reference materials, and relevant case coverage.</p>
      </div>

      <div className="border rounded-2xl shadow-sm p-8 bg-white">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Featured Durham Cases</h2>
        <p className="text-sm text-slate-600 mb-4">Recent reporting and legal developments from trusted sources.</p>

        <ul className="space-y-3">
          <li>
            <a
              href="https://9thstreetjournal.org/2025/10/27/judge-to-rule-soon-on-lawsuit-alleging-discrimination-against-n-c-s-young-voters/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <p className="text-xs font-semibold tracking-wide uppercase text-indigo-700">9th Street Journal</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-indigo-800">
                Judge to Rule Soon on Lawsuit Alleging Discrimination Against North Carolina’s Young Voters
              </p>
              <p className="mt-2 text-xs text-slate-500">Open Article →</p>
            </a>
          </li>
          <li>
            <a
              href="https://www.wral.com/video/former-durham-police-department-interim-chief-files-discrimination-claim/21965145/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <p className="text-xs font-semibold tracking-wide uppercase text-indigo-700">WRAL</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-indigo-800">
                Former Durham Police Department Interim Chief Files Discrimination Claim
              </p>
              <p className="mt-2 text-xs text-slate-500">Open Article →</p>
            </a>
          </li>
          <li>
            <a
              href="https://carolinapublicpress.org/72960/nursing-home-settlement-disability-rights-nc-lawsuit-substance-use-disorder/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group block rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 transition hover:border-indigo-300 hover:bg-indigo-50"
            >
              <p className="text-xs font-semibold tracking-wide uppercase text-indigo-700">Carolina Public Press</p>
              <p className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-indigo-800">
                North Carolina Nursing Home Settlement Highlights Disability Rights and Substance Use Disorder Protections
              </p>
              <p className="mt-2 text-xs text-slate-500">Open Article →</p>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
