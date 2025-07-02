import { DilutionRound } from './types';

export interface ExampleScenario {
  name: string;
  description: string;
  initialOwnership: number;
  rounds: DilutionRound[];
}

export const EXAMPLE_SCENARIOS: Record<string, ExampleScenario> = {
  seed_to_series_a: {
    name: "Typical Seed to Series A",
    description: "Standard progression from seed funding through Series A",
    initialOwnership: 100.0,
    rounds: [
      {
        type: "SAFE",
        investment: 500000,
        pre_money_valuation: 2000000,
        cap: 5000000,
        discount: 20.0,
        option_pool: 10.0
      },
      {
        type: "Priced Round",
        investment: 2000000,
        pre_money_valuation: 8000000,
        ownership_percentage: 20.0,
        option_pool: 15.0
      }
    ]
  },
  aggressive_growth: {
    name: "Aggressive Growth Path",
    description: "Multiple rounds with increasing valuations for high-growth startups",
    initialOwnership: 85.0,
    rounds: [
      {
        type: "SAFE",
        investment: 250000,
        pre_money_valuation: 1000000,
        cap: 3000000,
        discount: 25.0,
        option_pool: 5.0
      },
      {
        type: "Convertible Note",
        investment: 750000,
        pre_money_valuation: 4000000,
        interest_rate: 8.0,
        discount: 20.0,
        time_period: 1.5,
        cap: 6000000
      },
      {
        type: "Priced Round",
        investment: 3000000,
        pre_money_valuation: 12000000,
        ownership_percentage: 20.0,
        option_pool: 15.0
      },
      {
        type: "Priced Round",
        investment: 10000000,
        pre_money_valuation: 40000000,
        ownership_percentage: 20.0,
        option_pool: 5.0
      }
    ]
  },
  bootstrap_friendly: {
    name: "Bootstrap-Friendly Path",
    description: "Minimal dilution strategy for founders who want to retain control",
    initialOwnership: 100.0,
    rounds: [
      {
        type: "SAFE",
        investment: 150000,
        pre_money_valuation: 3000000,
        cap: 5000000,
        discount: 15.0,
        option_pool: 5.0
      },
      {
        type: "Priced Round",
        investment: 1000000,
        pre_money_valuation: 15000000,
        ownership_percentage: 6.25,
        option_pool: 10.0
      }
    ]
  },
  yc_style: {
    name: "Y Combinator Style",
    description: "Following the typical YC funding pattern",
    initialOwnership: 100.0,
    rounds: [
      {
        type: "SAFE",
        investment: 125000,
        pre_money_valuation: 1000000,
        cap: 2000000,
        discount: 0.0,
        option_pool: 0.0
      },
      {
        type: "SAFE",
        investment: 375000,
        pre_money_valuation: 3000000,
        cap: 8000000,
        discount: 20.0,
        option_pool: 10.0
      },
      {
        type: "Priced Round",
        investment: 2500000,
        pre_money_valuation: 10000000,
        ownership_percentage: 20.0,
        option_pool: 15.0
      }
    ]
  }
};

export const TERM_DEFINITIONS: Record<string, string> = {
  pre_money: "The valuation of a company before external funding or financing. This represents what the company is worth before the new investment.",
  post_money: "The valuation of a company after external funding has been added. Post-money = Pre-money + Investment Amount.",
  ownership_percentage: "The percentage of the company that investors will own after their investment. This determines how much equity founders give up.",
  dilution: "The reduction in existing shareholders' ownership percentage when new shares are issued. Each funding round typically dilutes all existing shareholders.",
  option_pool: "Shares set aside for future employees. Usually created before investment, diluting founders but not new investors.",
  safe: "Simple Agreement for Future Equity. A financing instrument that converts to equity at a future priced round, typically with a valuation cap and/or discount.",
  convertible_note: "A loan that converts to equity at a future financing round, usually with interest and a discount rate.",
  valuation_cap: "The maximum valuation at which a SAFE or convertible note will convert to equity, protecting early investors from high valuations.",
  discount_rate: "The percentage discount that SAFE or note holders get when converting to equity compared to new investors in the priced round.",
  liquidation_preference: "The right of investors to get their money back first (and sometimes more) before other shareholders in an exit event.",
  price_per_share: "The cost of one share, calculated by dividing the post-money valuation by the total number of shares.",
  priced_round: "A funding round where shares are sold at a specific price, establishing a clear valuation for the company.",
  anti_dilution: "Provisions that protect investors from dilution if the company raises money at a lower valuation in the future.",
  vesting: "The process by which founders and employees earn their equity over time, typically over 4 years with a 1-year cliff.",
  "409a_valuation": "An independent appraisal of a company's common stock value, required for setting exercise prices for employee stock options."
};