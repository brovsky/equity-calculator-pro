import { 
  ValuationResult, 
  ShareDistribution, 
  SAFEResult, 
  ConvertibleNoteResult, 
  PricedRoundResult,
  DilutionRound,
  DilutionResult,
  ShareClass,
  ExitProceeds,
  AntiDilutionResult,
  ParticipationModel,
  LiquidationPreferenceResult,
  DilutionImpact
} from './types';

export function calculateValuations(
  investmentAmount: number, 
  ownershipPercentage: number
): ValuationResult {
  if (ownershipPercentage <= 0 || ownershipPercentage >= 100) {
    throw new Error("Ownership percentage must be between 0 and 100");
  }

  if (investmentAmount <= 0) {
    throw new Error("Investment amount must be greater than 0");
  }

  const postMoneyValuation = investmentAmount / (ownershipPercentage / 100);
  const preMoneyValuation = postMoneyValuation - investmentAmount;

  return { preMoneyValuation, postMoneyValuation };
}

export function calculateShareDistribution(
  preMoneyValuation: number,
  investmentAmount: number,
  totalShares?: number,
  optionPoolPercentage: number = 0
): ShareDistribution | null {
  if (!totalShares) {
    return null;
  }

  if (optionPoolPercentage < 0 || optionPoolPercentage >= 100) {
    throw new Error("Option pool percentage must be between 0 and 100");
  }

  const postMoneyValuation = preMoneyValuation + investmentAmount;
  const pricePerShare = postMoneyValuation / totalShares;

  const optionPoolShares = Math.floor(totalShares * (optionPoolPercentage / 100));
  const remainingShares = totalShares - optionPoolShares;

  const investorPercentage = (investmentAmount / postMoneyValuation) * 100;
  const investorShares = Math.floor(remainingShares * (investorPercentage / 100));

  const founderShares = remainingShares - investorShares;

  return {
    founderShares,
    investorShares,
    optionPoolShares,
    pricePerShare
  };
}

export function calculateSAFEDilution(
  preMoneyValuation: number,
  safeAmount: number,
  safeCap: number,
  discountRate: number = 0
): SAFEResult {
  const discountedValuation = preMoneyValuation * (1 - discountRate / 100);
  const effectiveValuation = Math.min(safeCap, discountedValuation);
  
  const ownershipPercentage = (safeAmount / effectiveValuation) * 100;
  const postMoneyValuation = preMoneyValuation + safeAmount;
  
  return {
    effectiveValuation,
    ownershipPercentage,
    postMoneyValuation
  };
}

export function calculateConvertibleNoteDilution(
  preMoneyValuation: number,
  noteAmount: number,
  interestRate: number,
  discountRate: number,
  cap?: number,
  timePeriod: number = 1
): ConvertibleNoteResult {
  const conversionAmount = noteAmount * (1 + (interestRate / 100) * timePeriod);
  
  const discountedValuation = preMoneyValuation * (1 - discountRate / 100);
  
  const effectiveValuation = cap !== undefined 
    ? Math.min(cap, discountedValuation)
    : discountedValuation;
  
  const ownershipPercentage = (conversionAmount / effectiveValuation) * 100;
  
  return {
    conversionAmount,
    effectiveValuation,
    ownershipPercentage
  };
}

export function calculatePricedRoundDilution(
  preMoneyValuation: number,
  investmentAmount: number,
  pricePerShare: number
): PricedRoundResult {
  const postMoneyValuation = preMoneyValuation + investmentAmount;
  const sharesIssued = investmentAmount / pricePerShare;
  const ownershipPercentage = (investmentAmount / postMoneyValuation) * 100;
  
  return {
    sharesIssued,
    ownershipPercentage,
    postMoneyValuation
  };
}

export function runDilutionScenario(
  initialFounderOwnership: number,
  rounds: DilutionRound[]
): DilutionResult[] {
  const results: DilutionResult[] = [];
  let currentFounderOwnership = initialFounderOwnership;
  let currentValuation = 0;
  
  results.push({
    round: 'Initial',
    type: 'Founding',
    investment: 0,
    preMoneyValuation: 0,
    postMoneyValuation: 0,
    founderOwnership: currentFounderOwnership,
    investorOwnership: 0,
    optionPool: 0
  });
  
  rounds.forEach((roundData, i) => {
    const { type, investment } = roundData;
    const preMoneyValuation = roundData.pre_money_valuation ?? currentValuation;
    
    let ownershipPct = 0;
    let postMoneyValuation = preMoneyValuation;
    
    if (type === 'SAFE') {
      const cap = roundData.cap!;
      const discount = roundData.discount ?? 0;
      const result = calculateSAFEDilution(preMoneyValuation, investment, cap, discount);
      ownershipPct = result.ownershipPercentage;
      postMoneyValuation = result.postMoneyValuation;
      
    } else if (type === 'Convertible Note') {
      const interestRate = roundData.interest_rate!;
      const discount = roundData.discount!;
      const cap = roundData.cap;
      const timePeriod = roundData.time_period ?? 1;
      const result = calculateConvertibleNoteDilution(
        preMoneyValuation, investment, interestRate, discount, cap, timePeriod
      );
      ownershipPct = result.ownershipPercentage;
      postMoneyValuation = preMoneyValuation + investment;
      
    } else if (type === 'Priced Round') {
      ownershipPct = roundData.ownership_percentage!;
      postMoneyValuation = investment / (ownershipPct / 100);
    }
    
    const newFounderOwnership = currentFounderOwnership * (1 - ownershipPct / 100);
    const optionPool = roundData.option_pool ?? 0;
    
    const adjustedFounderOwnership = optionPool > 0 
      ? newFounderOwnership * (1 - optionPool / 100)
      : newFounderOwnership;
    
    results.push({
      round: `Round ${i + 1}`,
      type,
      investment,
      preMoneyValuation,
      postMoneyValuation,
      founderOwnership: adjustedFounderOwnership,
      investorOwnership: ownershipPct,
      optionPool
    });
    
    currentFounderOwnership = adjustedFounderOwnership;
    currentValuation = postMoneyValuation;
  });
  
  return results;
}

export function calculateExitProceeds(
  exitValue: number,
  shareClasses: ShareClass[],
  commonShares: number
): ExitProceeds {
  const sortedClasses = [...shareClasses].sort(
    (a, b) => (b.seniority ?? 0) - (a.seniority ?? 0)
  );
  
  const totalShares = commonShares + shareClasses.reduce((sum, sc) => sum + sc.shares, 0);
  
  let remaining = exitValue;
  const payouts: ExitProceeds = { common: 0 };
  
  sortedClasses.forEach(shareClass => {
    const { name, shares, price, liquidationMultiple, participating } = shareClass;
    const investment = shares * price;
    
    const preference = investment * liquidationMultiple;
    const prefPayout = Math.min(remaining, preference);
    remaining -= prefPayout;
    
    if (participating && remaining > 0) {
      const remainingShares = commonShares + shareClasses
        .filter(sc => sc.name !== name || sc.participating)
        .reduce((sum, sc) => sum + sc.shares, 0);
      
      const participation = (shares / remainingShares) * remaining;
      payouts[name] = prefPayout + participation;
      remaining -= participation;
    } else {
      const conversionValue = (shares / totalShares) * exitValue;
      if (conversionValue > prefPayout) {
        remaining += prefPayout;
        payouts[name] = conversionValue;
        remaining = exitValue * (1 - shares / totalShares);
      } else {
        payouts[name] = prefPayout;
      }
    }
  });
  
  payouts.common = Math.max(0, remaining);
  
  return payouts;
}

export function calculateAntiDilutionAdjustment(
  originalShares: number,
  originalPrice: number,
  newRoundAmount: number,
  newRoundPrice: number,
  totalSharesPre: number,
  method: 'full_ratchet' | 'broad_based' | 'narrow_based' = 'broad_based',
  optionPool: number = 0
): AntiDilutionResult {
  const originalInvestment = originalShares * originalPrice;
  
  let adjustedPrice: number;
  
  if (method === 'full_ratchet') {
    adjustedPrice = newRoundPrice;
  } else if (method === 'broad_based') {
    const a = totalSharesPre + optionPool;
    const b = newRoundAmount / originalPrice;
    const c = newRoundAmount / newRoundPrice;
    adjustedPrice = originalPrice * (a + b) / (a + c);
  } else if (method === 'narrow_based') {
    const a = totalSharesPre;
    const b = newRoundAmount / originalPrice;
    const c = newRoundAmount / newRoundPrice;
    adjustedPrice = originalPrice * (a + b) / (a + c);
  } else {
    adjustedPrice = originalPrice;
  }
  
  const newTotalShares = originalInvestment / adjustedPrice;
  const additionalShares = Math.max(0, newTotalShares - originalShares);
  
  return {
    adjustedPrice,
    additionalShares,
    totalShares: newTotalShares,
    priceReduction: originalPrice - adjustedPrice,
    dilutionProtection: (additionalShares / originalShares) * 100
  };
}

export function modelParticipationRights(
  exitValues: number[],
  preferredShares: number,
  preferredPrice: number,
  totalShares: number,
  liquidationMultiple: number = 1.0,
  participationCap?: number
): ParticipationModel {
  const investment = preferredShares * preferredPrice;
  const ownershipPct = preferredShares / totalShares;
  
  const nonParticipating: number[] = [];
  const participating: number[] = [];
  const participatingCapped: number[] = [];
  
  exitValues.forEach(exitVal => {
    const liqPref = investment * liquidationMultiple;
    const conversion = exitVal * ownershipPct;
    const nonPart = Math.max(liqPref, conversion);
    nonParticipating.push(nonPart);
    
    const prefPayout = Math.min(liqPref, exitVal);
    const remaining = Math.max(0, exitVal - prefPayout);
    const participation = remaining * ownershipPct;
    const part = prefPayout + participation;
    participating.push(part);
    
    if (participationCap) {
      const cap = investment * participationCap;
      const partCapped = Math.min(part, cap);
      const finalPayout = conversion > partCapped ? conversion : partCapped;
      participatingCapped.push(finalPayout);
    } else {
      participatingCapped.push(part);
    }
  });
  
  return {
    nonParticipating,
    participating,
    participatingCapped,
    commonWithNonPart: exitValues.map((val, i) => val - nonParticipating[i]),
    commonWithPart: exitValues.map((val, i) => val - participating[i]),
    commonWithCapped: exitValues.map((val, i) => val - participatingCapped[i])
  };
}

export function calculateLiquidationPreferenceImpact(
  exitValue: number,
  investment: number,
  ownershipPct: number,
  liquidationMultiple: number = 1.0,
  participating: boolean = false,
  participationCap?: number
): LiquidationPreferenceResult {
  const preference = investment * liquidationMultiple;
  const conversionValue = exitValue * ownershipPct;
  
  if (!participating) {
    const prefPayout = Math.min(preference, exitValue);
    const investorPayout = Math.max(prefPayout, conversionValue);
    const choseConversion = conversionValue > prefPayout;
    
    return {
      investorPayout,
      commonPayout: exitValue - investorPayout,
      choseConversion,
      preferenceAmount: preference,
      conversionValue,
      investorROI: (investorPayout / investment - 1) * 100,
      investorMultiple: investorPayout / investment
    };
  } else {
    const prefPayout = Math.min(preference, exitValue);
    const remaining = exitValue - prefPayout;
    const participation = remaining * ownershipPct;
    let totalPayout = prefPayout + participation;
    
    if (participationCap) {
      const cap = investment * participationCap;
      totalPayout = Math.min(totalPayout, cap);
      
      if (conversionValue > totalPayout) {
        return {
          investorPayout: conversionValue,
          commonPayout: exitValue - conversionValue,
          choseConversion: true,
          preferenceAmount: preference,
          conversionValue,
          investorROI: (conversionValue / investment - 1) * 100,
          investorMultiple: conversionValue / investment
        };
      }
    }
    
    return {
      investorPayout: totalPayout,
      commonPayout: exitValue - totalPayout,
      choseConversion: false,
      preferenceAmount: preference,
      participationAmount: participation,
      conversionValue,
      investorROI: (totalPayout / investment - 1) * 100,
      investorMultiple: totalPayout / investment
    };
  }
}

export function findBreakevenExit(
  shareClasses: ShareClass[],
  commonShares: number,
  targetReturn: number = 1.0
): number {
  let low = 0;
  let high = 1e12;
  const epsilon = 1000;
  
  const commonInvestment = commonShares * 0.001;
  
  while (high - low > epsilon) {
    const mid = (low + high) / 2;
    const payouts = calculateExitProceeds(mid, shareClasses, commonShares);
    const commonReturn = payouts.common / commonInvestment;
    
    if (commonReturn < targetReturn) {
      low = mid;
    } else {
      high = mid;
    }
  }
  
  return (low + high) / 2;
}

export function calculateDilutionFromAntiDilution(
  additionalShares: number,
  totalSharesPre: number,
  shareClasses: ShareClass[]
): Record<string, DilutionImpact> {
  const totalSharesPost = totalSharesPre + additionalShares;
  const dilutionImpact: Record<string, DilutionImpact> = {};
  
  shareClasses.forEach(shareClass => {
    const { name, shares } = shareClass;
    
    const ownershipPre = shares / totalSharesPre;
    const ownershipPost = shares / totalSharesPost;
    const dilution = ownershipPre - ownershipPost;
    const dilutionPct = ownershipPre > 0 ? (dilution / ownershipPre) * 100 : 0;
    
    dilutionImpact[name] = {
      ownershipPre: ownershipPre * 100,
      ownershipPost: ownershipPost * 100,
      dilutionPct,
      sharesToMaintain: shares * (totalSharesPost / totalSharesPre) - shares
    };
  });
  
  return dilutionImpact;
}