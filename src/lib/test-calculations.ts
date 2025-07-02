import {
  calculateValuations,
  calculateSAFEDilution,
  calculateConvertibleNoteDilution,
  runDilutionScenario
} from './calculations';

export function runCalculationTests(): boolean {
  try {
    console.log('Running calculation tests...');

    // Test basic valuation calculation
    const valuationResult = calculateValuations(1000000, 20);
    console.log('Valuation test:', valuationResult);
    
    if (valuationResult.postMoneyValuation !== 5000000) {
      throw new Error('Valuation calculation failed');
    }

    // Test SAFE calculation
    const safeResult = calculateSAFEDilution(4000000, 500000, 5000000, 20);
    console.log('SAFE test:', safeResult);
    
    if (safeResult.effectiveValuation !== 3200000) {
      throw new Error('SAFE calculation failed');
    }

    // Test convertible note calculation
    const noteResult = calculateConvertibleNoteDilution(8000000, 500000, 8, 20, 5000000, 1);
    console.log('Convertible note test:', noteResult);
    
    if (noteResult.conversionAmount !== 540000) {
      throw new Error('Convertible note calculation failed');
    }

    // Test dilution scenario
    const dilutionResult = runDilutionScenario(100, [
      {
        type: 'SAFE',
        investment: 500000,
        cap: 5000000,
        discount: 20,
        option_pool: 10
      }
    ]);
    console.log('Dilution scenario test:', dilutionResult);
    
    if (dilutionResult.length !== 2) {
      throw new Error('Dilution scenario calculation failed');
    }

    console.log('✅ All calculation tests passed!');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}