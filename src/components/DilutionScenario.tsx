'use client';

import { useState } from 'react';
import { runDilutionScenario } from '@/lib/calculations';
import { DilutionRound, DilutionResult } from '@/lib/types';
import { formatCurrencyInput, parseFormattedNumber } from '@/lib/formatters';

interface DilutionScenarioProps {
  onDilutionUpdate?: (data: DilutionResult[]) => void;
  onCompanyNameUpdate?: (name: string) => void;
}

export function DilutionScenario({ onDilutionUpdate, onCompanyNameUpdate }: DilutionScenarioProps) {
  const [initialFounderOwnership, setInitialFounderOwnership] = useState<string>('100');
  const [rounds, setRounds] = useState<DilutionRound[]>([]);
  const [results, setResults] = useState<DilutionResult[]>([]);
  const [error, setError] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('Your Company');

  const [newRound, setNewRound] = useState<Partial<DilutionRound>>({
    type: 'SAFE',
    investment: undefined,
    cap: undefined,
    discount: 0,
    option_pool: 0
  });

  // Formatted input states
  const [investmentDisplay, setInvestmentDisplay] = useState<string>('');
  const [capDisplay, setCapDisplay] = useState<string>('');

  const handleAddRound = () => {
    try {
      if (!newRound.investment || newRound.investment <= 0) {
        throw new Error('Investment amount is required');
      }

      if (newRound.type === 'SAFE' && !newRound.cap) {
        throw new Error('Valuation cap is required for SAFE notes');
      }

      if (newRound.type === 'Convertible Note' && (!newRound.interest_rate || !newRound.discount)) {
        throw new Error('Interest rate and discount are required for convertible notes');
      }

      if (newRound.type === 'Priced Round' && !newRound.ownership_percentage) {
        throw new Error('Ownership percentage is required for priced rounds');
      }

      const roundToAdd: DilutionRound = {
        type: newRound.type!,
        investment: newRound.investment,
        cap: newRound.cap,
        discount: newRound.discount || 0,
        interest_rate: newRound.interest_rate,
        ownership_percentage: newRound.ownership_percentage,
        time_period: newRound.time_period || 1,
        option_pool: newRound.option_pool || 0
      };

      setRounds([...rounds, roundToAdd]);
      setNewRound({
        type: 'SAFE',
        investment: undefined,
        cap: undefined,
        discount: 0,
        option_pool: 0
      });
      // Clear display states
      setInvestmentDisplay('');
      setCapDisplay('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRunScenario = () => {
    try {
      setError('');
      const ownership = parseFloat(initialFounderOwnership);
      
      if (isNaN(ownership) || ownership <= 0 || ownership > 100) {
        throw new Error('Initial founder ownership must be between 0 and 100');
      }

      if (rounds.length === 0) {
        throw new Error('Add at least one funding round');
      }

      const scenarioResults = runDilutionScenario(ownership, rounds);
      setResults(scenarioResults);

      // Update parent components
      if (onDilutionUpdate) {
        onDilutionUpdate(scenarioResults);
      }
      if (onCompanyNameUpdate) {
        onCompanyNameUpdate(companyName);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    }
  };

  const handleRemoveRound = (index: number) => {
    setRounds(rounds.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Multi-Round Dilution Scenario</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your company name"
            />
          </div>

          <div>
            <label htmlFor="initialOwnership" className="block text-sm font-medium text-gray-700 mb-2">
              Initial Founder Ownership (%)
            </label>
            <input
              id="initialOwnership"
              type="number"
              step="0.1"
              value={initialFounderOwnership}
              onChange={(e) => setInitialFounderOwnership(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="border p-4 rounded-lg bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Funding Round</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Round Type</label>
                <select
                  value={newRound.type}
                  onChange={(e) => setNewRound({...newRound, type: e.target.value as 'SAFE' | 'Convertible Note' | 'Priced Round'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="SAFE">SAFE Note</option>
                  <option value="Convertible Note">Convertible Note</option>
                  <option value="Priced Round">Priced Round</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount ($)</label>
                <input
                  type="text"
                  value={investmentDisplay}
                  onChange={(e) => {
                    const formatted = formatCurrencyInput(e.target.value);
                    const numeric = parseFormattedNumber(e.target.value);
                    setInvestmentDisplay(formatted);
                    setNewRound({...newRound, investment: numeric || undefined});
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 1,000,000"
                />
              </div>

              {newRound.type === 'SAFE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valuation Cap ($)</label>
                    <input
                      type="text"
                      value={capDisplay}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        const numeric = parseFormattedNumber(e.target.value);
                        setCapDisplay(formatted);
                        setNewRound({...newRound, cap: numeric || undefined});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newRound.discount || ''}
                      onChange={(e) => setNewRound({...newRound, discount: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 20"
                    />
                  </div>
                </>
              )}

              {newRound.type === 'Convertible Note' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valuation Cap ($) - Optional</label>
                    <input
                      type="text"
                      value={capDisplay}
                      onChange={(e) => {
                        const formatted = formatCurrencyInput(e.target.value);
                        const numeric = parseFormattedNumber(e.target.value);
                        setCapDisplay(formatted);
                        setNewRound({...newRound, cap: numeric || undefined});
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5,000,000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newRound.interest_rate || ''}
                      onChange={(e) => setNewRound({...newRound, interest_rate: parseFloat(e.target.value) || undefined})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newRound.discount || ''}
                      onChange={(e) => setNewRound({...newRound, discount: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (Years)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newRound.time_period || ''}
                      onChange={(e) => setNewRound({...newRound, time_period: parseFloat(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 1.5"
                    />
                  </div>
                </>
              )}

              {newRound.type === 'Priced Round' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ownership Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRound.ownership_percentage || ''}
                    onChange={(e) => setNewRound({...newRound, ownership_percentage: parseFloat(e.target.value) || undefined})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 25"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Option Pool (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newRound.option_pool || ''}
                  onChange={(e) => setNewRound({...newRound, option_pool: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 15"
                />
              </div>

              <button
                onClick={handleAddRound}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Round
              </button>
            </div>
          </div>

          {rounds.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Added Rounds</h3>
              <div className="space-y-2">
                {rounds.map((round, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-100 rounded-md">
                    <div>
                      <span className="font-medium">{round.type}</span> - {formatCurrency(round.investment)}
                    </div>
                    <button
                      onClick={() => handleRemoveRound(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              
              <button
                onClick={handleRunScenario}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Run Dilution Scenario
              </button>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div>
          {results.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dilution Analysis</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Round</th>
                      <th className="text-right py-2">Investment</th>
                      <th className="text-right py-2">Post-Money</th>
                      <th className="text-right py-2">Founder %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{result.round}</td>
                        <td className="text-right py-2">
                          {result.investment > 0 ? formatCurrency(result.investment) : '-'}
                        </td>
                        <td className="text-right py-2">
                          {result.postMoneyValuation > 0 ? formatCurrency(result.postMoneyValuation) : '-'}
                        </td>
                        <td className="text-right py-2 font-medium">
                          {result.founderOwnership.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <div className="text-sm text-blue-800">
                  <div className="font-medium">Final Founder Ownership: {results[results.length - 1]?.founderOwnership.toFixed(1)}%</div>
                  <div>Total Dilution: {(100 - results[results.length - 1]?.founderOwnership).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}