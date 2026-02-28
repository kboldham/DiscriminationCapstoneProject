export default function Documentation() {
  const resourceCards = [
    {
      source: "9th Street Journal",
      title: "Judge to Rule Soon on Lawsuit Alleging Discrimination Against North Carolina’s Young Voters",
      href: "https://9thstreetjournal.org/2025/10/27/judge-to-rule-soon-on-lawsuit-alleging-discrimination-against-n-c-s-young-voters/?utm_source=chatgpt.com",
      image: "/images/resources/voters.svg",
      topic: "Voting Rights",
      area: "North Carolina",
    },
    {
      source: "WRAL",
      title: "Former Durham Police Department Interim Chief Files Discrimination Claim",
      href: "https://www.wral.com/video/former-durham-police-department-interim-chief-files-discrimination-claim/21965145/?utm_source=chatgpt.com",
      image: "/images/resources/police.svg",
      topic: "Employment",
      area: "Durham",
    },
    {
      source: "Carolina Public Press",
      title: "North Carolina Nursing Home Settlement Highlights Disability Rights and Substance Use Disorder Protections",
      href: "https://carolinapublicpress.org/72960/nursing-home-settlement-disability-rights-nc-lawsuit-substance-use-disorder/?utm_source=chatgpt.com",
      image: "/images/resources/healthcare.svg",
      topic: "Disability Rights",
      area: "North Carolina",
    },
  ];

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
          {resourceCards.map((card) => (
            <li key={card.href}>
              <a
                href={card.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block overflow-hidden rounded-xl border border-indigo-200 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.34), rgba(239,246,255,0.4)), url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "normal",
                }}
              >
                <div className="bg-white/60 backdrop-blur-[1px] p-4">
                  <p className="inline-flex rounded-full border border-indigo-200 bg-white/80 px-2.5 py-1 text-[11px] font-semibold tracking-wide uppercase text-indigo-700">{card.source}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900 group-hover:text-indigo-800">{card.title}</p>
                  <p className="mt-2 text-xs text-slate-600">{card.topic} · {card.area}</p>
                  <p className="mt-2 text-xs font-medium text-slate-600">Open Article →</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
