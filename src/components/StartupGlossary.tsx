'use client';

import { TERM_DEFINITIONS } from '@/lib/examples';

export function StartupGlossary() {
  // Expanded glossary with additional startup funding terms
  const expandedTerms = {
    ...TERM_DEFINITIONS,
    "accredited_investor": "An individual or entity that meets certain income or net worth requirements set by the SEC, allowing them to invest in private securities offerings.",
    "bridge_round": "A short-term financing round designed to fund a company until its next major funding round or milestone.",
    "burn_rate": "The rate at which a company spends its available capital, typically measured monthly.",
    "cap_table": "A capitalization table showing the ownership percentages, equity dilution, and value of equity in each round of investment.",
    "carry": "The share of profits that general partners in a venture capital fund receive, typically 20% of the fund's profits.",
    "cliff": "A period during which no equity vests, commonly one year for employee stock options.",
    "down_round": "A financing round where the company's valuation is lower than in the previous round, resulting in dilution for existing shareholders.",
    "drag_along_rights": "A provision that enables majority shareholders to force minority shareholders to join in the sale of a company.",
    "dry_powder": "The amount of committed but uninvested capital that a venture capital fund has available.",
    "equity_financing": "Raising capital by selling shares of ownership in the company to investors.",
    "follow_on_investment": "Additional investment made by existing investors in subsequent funding rounds.",
    "general_partner": "The managing partner of a venture capital fund who makes investment decisions and manages the fund.",
    "information_rights": "The right of investors to receive regular financial and operational updates from the company.",
    "ipo": "Initial Public Offering - the first sale of a company's shares to the public on a stock exchange.",
    "lead_investor": "The investor who takes the primary role in a funding round, often setting the terms and conducting due diligence.",
    "limited_partner": "An investor in a venture capital fund who provides capital but does not participate in management decisions.",
    "mezzanine_financing": "A hybrid form of financing that combines debt and equity, typically used for expansion or buyouts.",
    "milestone": "Specific goals or achievements that a company must reach, often tied to funding releases.",
    "pitch_deck": "A presentation used by entrepreneurs to provide investors with a quick overview of their business plan.",
    "runway": "The amount of time a company can operate with its current cash before needing additional funding.",
    "series_funding": "Sequential rounds of funding labeled alphabetically (Series A, B, C, etc.) as a company grows.",
    "tag_along_rights": "Rights that allow minority shareholders to join when majority shareholders sell their shares.",
    "term_sheet": "A non-binding document outlining the basic terms and conditions of an investment.",
    "unicorn": "A privately-held startup company valued at over $1 billion.",
    "up_round": "A financing round where the company's valuation is higher than in the previous round.",
    "waterfall": "The order in which proceeds from an exit are distributed among different classes of shareholders.",
    "warrant": "A security that gives the holder the right to purchase stock at a specific price within a certain time period."
  };

  // Group terms alphabetically
  const groupedTerms = Object.entries(expandedTerms).reduce((acc, [key, definition]) => {
    const firstLetter = key.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push({ key, definition });
    return acc;
  }, {} as Record<string, Array<{ key: string; definition: string }>>);

  const formatTermName = (term: string) => {
    return term
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase())
      .replace(/409a/i, '409A')
      .replace(/Ipo/i, 'IPO')
      .replace(/Sec/i, 'SEC');
  };

  return (
    <section className="mt-16 mb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="main-header text-3xl font-bold text-gray-900 mb-4">
            📖 Startup Funding Glossary
          </h2>
          <p className="subheader text-lg text-gray-600 max-w-3xl mx-auto">
            Essential terms every founder and investor should know when navigating 
            the startup funding landscape
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {Object.entries(groupedTerms)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, terms]) => (
              <div key={letter} className="mb-8">
                <h3 className="text-2xl font-bold text-blue-600 mb-4 pb-2 border-b-2 border-blue-100">
                  {letter}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {terms
                    .sort((a, b) => a.key.localeCompare(b.key))
                    .map(({ key, definition }) => (
                      <div key={key} className="glossary-term-card p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                        <h4 className="font-semibold text-gray-900 mb-2 text-lg">
                          {formatTermName(key)}
                        </h4>
                        <p className="text-gray-700 leading-relaxed">
                          {definition}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-2xl">💡</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                Need Help Understanding These Terms?
              </h3>
              <p className="text-blue-800 mb-3">
                Many of these concepts are interconnected. Use the calculators above to see how 
                these terms work in practice with real numbers and scenarios.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>For Founders:</strong> Focus on understanding dilution, 
                  liquidation preferences, and anti-dilution provisions
                </div>
                <div>
                  <strong>For Investors:</strong> Key terms include participation rights, 
                  liquidation multiples, and conversion mechanics
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            This glossary covers the most common startup funding terms. For specific legal or 
            financial advice, consult with qualified professionals.
          </p>
        </div>
      </div>
    </section>
  );
}