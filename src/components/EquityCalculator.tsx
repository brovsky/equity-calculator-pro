'use client';

import { useState } from 'react';
import { ValuationCalculator } from './ValuationCalculator';
import { SAFECalculator } from './SAFECalculator';
import { ConvertibleNoteCalculator } from './ConvertibleNoteCalculator';
import { DilutionScenario } from './DilutionScenario';
import { ExitAnalysis } from './ExitAnalysis';

type CalculatorType = 'valuation' | 'safe' | 'convertible' | 'dilution' | 'exit';

export function EquityCalculator() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('valuation');

  const calculators = [
    { id: 'valuation', name: 'Valuation Calculator', description: 'Calculate pre and post-money valuations' },
    { id: 'safe', name: 'SAFE Notes', description: 'Analyze SAFE note dilution' },  
    { id: 'convertible', name: 'Convertible Notes', description: 'Calculate convertible note conversions' },
    { id: 'dilution', name: 'Dilution Scenarios', description: 'Model multiple funding rounds' },
    { id: 'exit', name: 'Exit Analysis', description: 'Analyze liquidation preferences and payouts' }
  ] as const;

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'valuation':
        return <ValuationCalculator />;
      case 'safe':
        return <SAFECalculator />;
      case 'convertible':
        return <ConvertibleNoteCalculator />;
      case 'dilution':
        return <DilutionScenario />;
      case 'exit':
        return <ExitAnalysis />;
      default:
        return <ValuationCalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Equity Calculator Pro
          </h1>
          <p className="text-gray-600">
            Comprehensive startup equity and valuation analysis tools
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <nav className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Calculators</h2>
              <div className="space-y-2">
                {calculators.map((calc) => (
                  <button
                    key={calc.id}
                    onClick={() => setActiveCalculator(calc.id as CalculatorType)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      activeCalculator === calc.id
                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-900'
                        : 'hover:bg-gray-50 border-2 border-transparent text-gray-700'
                    }`}
                  >
                    <div className="font-medium">{calc.name}</div>
                    <div className="text-sm text-gray-500 mt-1">{calc.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          <main className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {renderCalculator()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}