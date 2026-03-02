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

  const discriminationCategories = [
    {
      title: "Employment",
      examples: "Hiring bias, unequal pay, harassment, retaliation, wrongful termination.",
    },
    {
      title: "Housing",
      examples: "Refusing to rent or sell, steering, unfair screening, discriminatory terms.",
    },
    {
      title: "Public Accommodations",
      examples: "Unequal service in stores, restaurants, healthcare, schools, or transportation.",
    },
    {
      title: "Disability & Accessibility",
      examples: "Failure to provide reasonable accommodations or accessible services.",
    },
  ];

  const actionSteps = [
    "Document what happened right away: dates, times, locations, people involved, and what was said or done.",
    "Save evidence: emails, texts, voicemails, photos, screenshots, letters, and relevant policies.",
    "Identify witnesses and keep their contact details in case follow-up is needed.",
    "Report internally when possible (HR, landlord, school office, service manager) and keep a copy of your complaint.",
    "File with the appropriate agency if needed and track deadlines for complaints or appeals.",
    "Seek legal or advocacy guidance early, especially if safety, employment, or housing is at risk.",
  ];

  const supportResources = [
    {
      name: "EEOC",
      description: "Federal employment discrimination complaints and guidance.",
      href: "https://www.eeoc.gov/",
    },
    {
      name: "HUD Fair Housing",
      description: "Housing discrimination reporting and rights information.",
      href: "https://www.hud.gov/fairhousing",
    },
    {
      name: "N.C. Human Relations Commission",
      description: "State-level support and information on discrimination matters.",
      href: "https://www.doa.nc.gov/divisions/council-women-youth-involvement/human-relations-commission",
    },
    {
      name: "Legal Aid of North Carolina",
      description: "Legal help, referrals, and community legal resources.",
      href: "https://legalaidnc.org/",
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
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">What Falls Under Discrimination?</h2>
        <p className="text-sm text-slate-600 mb-4">Discrimination can appear in many contexts. Common categories include:</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {discriminationCategories.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-600 mt-1 leading-relaxed">{item.examples}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="border rounded-2xl shadow-sm p-8 bg-white">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Courses of Action You Can Take</h2>
        <p className="text-sm text-slate-600 mb-4">Use this checklist to respond quickly and protect your options.</p>

        <ol className="space-y-3">
          {actionSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="border rounded-2xl shadow-sm p-8 bg-white">
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Support Resources</h2>
        <p className="text-sm text-slate-600 mb-4">These organizations can help with reporting steps, rights information, and legal support.</p>

        <ul className="space-y-3">
          {supportResources.map((resource) => (
            <li key={resource.href}>
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-slate-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-sm"
              >
                <p className="font-semibold text-slate-900 group-hover:text-indigo-700">{resource.name}</p>
                <p className="text-sm text-slate-600 mt-1">{resource.description}</p>
              </a>
            </li>
          ))}
        </ul>
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
