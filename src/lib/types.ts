export interface ValuationResult {
  preMoneyValuation: number;
  postMoneyValuation: number;
}

export interface ShareDistribution {
  founderShares: number;
  investorShares: number;
  optionPoolShares: number;
  pricePerShare: number;
}

export interface SAFEResult {
  effectiveValuation: number;
  ownershipPercentage: number;
  postMoneyValuation: number;
}

export interface ConvertibleNoteResult {
  conversionAmount: number;
  effectiveValuation: number;
  ownershipPercentage: number;
}

export interface PricedRoundResult {
  sharesIssued: number;
  ownershipPercentage: number;
  postMoneyValuation: number;
}

export interface DilutionRound {
  type: 'SAFE' | 'Convertible Note' | 'Priced Round';
  investment: number;
  pre_money_valuation?: number;
  ownership_percentage?: number;
  cap?: number;
  discount?: number;
  interest_rate?: number;
  time_period?: number;
  option_pool?: number;
}

export interface DilutionResult {
  round: string;
  type: string;
  investment: number;
  preMoneyValuation: number;
  postMoneyValuation: number;
  founderOwnership: number;
  investorOwnership: number;
  optionPool: number;
}

export interface ShareClass {
  name: string;
  shares: number;
  price: number;
  liquidationMultiple: number;
  participating: boolean;
  seniority?: number;
}

export interface ExitProceeds {
  [className: string]: number;
}

export interface AntiDilutionResult {
  adjustedPrice: number;
  additionalShares: number;
  totalShares: number;
  priceReduction: number;
  dilutionProtection: number;
}

export interface ParticipationModel {
  nonParticipating: number[];
  participating: number[];
  participatingCapped: number[];
  commonWithNonPart: number[];
  commonWithPart: number[];
  commonWithCapped: number[];
}

export interface LiquidationPreferenceResult {
  investorPayout: number;
  commonPayout: number;
  choseConversion: boolean;
  preferenceAmount: number;
  participationAmount?: number;
  conversionValue: number;
  investorROI: number;
  investorMultiple: number;
}

export interface DilutionImpact {
  ownershipPre: number;
  ownershipPost: number;
  dilutionPct: number;
  sharesToMaintain: number;
}